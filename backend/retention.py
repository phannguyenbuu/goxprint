"""Data retention module – 4-tier automatic purge for time-series tables.

Retention policy (applied every 10 minutes):

  Tier 1 │ Last 10 min          │ Keep ALL records (full resolution)
  Tier 2 │ 10 min → 5 h 10 min  │ Keep 1 record per 10-minute bucket
  Tier 3 │ 5 h 10 min → 7 days  │ Keep 1 record per day
  Tier 4 │ Older than 7 days    │ Keep 1 record per week (permanent)

Tables handled:
  CounterInfor, StatusInfor          – grouped by (lead, lan_uid, ip)
  DeviceInforHistory                 – grouped by (lead, lan_uid, mac_id)
  AgentPresenceLog                   – grouped by (lead, lan_uid, agent_uid)
  PrinterOnlineLog                   – grouped by (lead, lan_uid, ip)
"""

from __future__ import annotations

import logging
import threading
from datetime import datetime, timedelta, timezone

from sqlalchemy import text

LOGGER = logging.getLogger(__name__)

RETENTION_INTERVAL_SECONDS = 600  # run every 10 minutes


# ── table definitions ────────────────────────────────────────────────
# (table_name, timestamp_column, group_by_columns)
_RETENTION_TABLES: list[tuple[str, str, str]] = [
    ("CounterInfor",       "timestamp",  "lead, lan_uid, ip"),
    ("StatusInfor",        "timestamp",  "lead, lan_uid, ip"),
    ("DeviceInforHistory", "created_at", "lead, lan_uid, mac_id"),
    ("AgentPresenceLog",   "created_at", "lead, lan_uid, agent_uid"),
    ("PrinterOnlineLog",   "created_at", "lead, lan_uid, ip"),
]

# ── tier boundaries ──────────────────────────────────────────────────
_TIER_2_START = timedelta(minutes=10)   # 10 min ago
_TIER_3_START = timedelta(hours=5, minutes=10)  # 5 h 10 min ago
_TIER_4_START = timedelta(days=7)       # 7 days ago


def _run_once(session_factory) -> dict[str, int]:
    """Execute one retention pass.  Returns ``{table: total_deleted}``."""
    now = datetime.now(timezone.utc)
    cutoff_t2 = now - _TIER_2_START  # older than 10 min
    cutoff_t3 = now - _TIER_3_START  # older than 5h10m
    cutoff_t4 = now - _TIER_4_START  # older than 7 days
    results: dict[str, int] = {}

    for table, ts_col, group_cols in _RETENTION_TABLES:
        total_deleted = 0

        # ── Tier 2: 10 min .. 5h10m  →  keep 1 per 10-minute bucket ──
        sql_t2 = text(f'''
            DELETE FROM "{table}"
            WHERE "{ts_col}" >= :t3 AND "{ts_col}" < :t2
              AND id NOT IN (
                  SELECT MIN(id) FROM "{table}"
                  WHERE "{ts_col}" >= :t3 AND "{ts_col}" < :t2
                  GROUP BY {group_cols},
                           TO_TIMESTAMP(FLOOR(EXTRACT(EPOCH FROM "{ts_col}") / 600) * 600)
              )
        ''')

        # ── Tier 3: 5h10m .. 7 days  →  keep 1 per day ──────────────
        sql_t3 = text(f'''
            DELETE FROM "{table}"
            WHERE "{ts_col}" >= :t4 AND "{ts_col}" < :t3
              AND id NOT IN (
                  SELECT MIN(id) FROM "{table}"
                  WHERE "{ts_col}" >= :t4 AND "{ts_col}" < :t3
                  GROUP BY {group_cols}, DATE_TRUNC('day', "{ts_col}")
              )
        ''')

        # ── Tier 4: > 7 days  →  keep 1 per week (permanent) ────────
        sql_t4 = text(f'''
            DELETE FROM "{table}"
            WHERE "{ts_col}" < :t4
              AND id NOT IN (
                  SELECT MIN(id) FROM "{table}"
                  WHERE "{ts_col}" < :t4
                  GROUP BY {group_cols}, DATE_TRUNC('week', "{ts_col}")
              )
        ''')

        try:
            with session_factory() as session:
                r2 = session.execute(sql_t2, {"t2": cutoff_t2, "t3": cutoff_t3}).rowcount
                r3 = session.execute(sql_t3, {"t3": cutoff_t3, "t4": cutoff_t4}).rowcount
                r4 = session.execute(sql_t4, {"t4": cutoff_t4}).rowcount
                session.commit()
                total_deleted = r2 + r3 + r4
                results[table] = total_deleted
                if total_deleted:
                    LOGGER.info(
                        "retention: %s deleted %d (tier2=%d tier3=%d tier4=%d)",
                        table, total_deleted, r2, r3, r4,
                    )
                else:
                    LOGGER.debug("retention: %s 0 deleted", table)
        except Exception:
            LOGGER.exception("retention: error cleaning %s", table)
            results[table] = -1

    # ── Strict 200-record retention for PrinterControlCommand (Jobs) ──────
    try:
        with session_factory() as session:
            r_jobs = session.execute(text('''
                DELETE FROM "PrinterControlCommand"
                WHERE id NOT IN (
                    SELECT id FROM "PrinterControlCommand" ORDER BY id DESC LIMIT 200
                )
            ''')).rowcount
            session.commit()
            if r_jobs:
                LOGGER.info("retention: PrinterControlCommand purged %d old jobs (kept top 200)", r_jobs)
                results["PrinterControlCommand"] = r_jobs
    except Exception:
        LOGGER.exception("retention: error cleaning PrinterControlCommand")

    return results


# ── scheduler ────────────────────────────────────────────────────────

_timer: threading.Timer | None = None


def _scheduled_run(session_factory) -> None:
    """Wrapper called by the timer; reschedules itself after each run."""
    global _timer
    try:
        LOGGER.info("retention: starting scheduled run")
        _run_once(session_factory)
        LOGGER.info("retention: scheduled run complete")
    except Exception:
        LOGGER.exception("retention: scheduled run failed")
    finally:
        _timer = threading.Timer(RETENTION_INTERVAL_SECONDS, _scheduled_run, args=(session_factory,))
        _timer.daemon = True
        _timer.start()


def start_retention_scheduler(session_factory, run_at_startup: bool = True) -> None:
    """Start the retention background thread.

    Parameters
    ----------
    session_factory : callable
        SQLAlchemy ``sessionmaker`` (or compatible callable).
    run_at_startup : bool
        If *True* the first cleanup runs immediately in a background thread
        instead of waiting for the interval.
    """
    global _timer
    if _timer is not None:
        return  # already running

    if run_at_startup:
        # Run the first pass in a background thread right away.
        t = threading.Thread(target=_scheduled_run, args=(session_factory,), daemon=True)
        t.start()
    else:
        _timer = threading.Timer(RETENTION_INTERVAL_SECONDS, _scheduled_run, args=(session_factory,))
        _timer.daemon = True
        _timer.start()

    LOGGER.info(
        "retention: scheduler started (interval=%ds, immediate=%s)",
        RETENTION_INTERVAL_SECONDS,
        run_at_startup,
    )
