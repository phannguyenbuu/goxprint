from __future__ import annotations

import logging
from typing import Any
from pathlib import Path
import time as time_module

from flask import Flask, redirect, render_template, request, url_for, jsonify

from utils import _to_text, _parse_timestamp
from serializers import _serialize_lead_model
from app_helpers import _load_agent_release_manifest, _format_agents_datetime_ui

PUBLIC_API_FILE = Path("PUBLIC_API.md")

LOGGER = logging.getLogger(__name__)

def register_ui_routes(app: Flask, session_factory: Any) -> None:

    @app.get("/")
    def index() -> Any:
        return redirect(url_for("dashboard"))

    @app.get("/dashboard")
    def dashboard() -> Any:
        return render_template("dashboard.html", active_tab="dashboard", page_title="Configuration")

    @app.get("/configs")
    def configs_page() -> Any:
        return render_template("configs.html", active_tab="configs", page_title="Display Configs")

    @app.get("/devices")
    def devices_page() -> Any:
        return redirect(url_for("infor_page"))

    @app.get("/infor")
    def infor_page() -> Any:
        return render_template("devices.html", active_tab="infor", page_title="Infor")

    @app.get("/api-docs")
    def api_docs_page() -> Any:
        markdown_text = ""
        try:
            markdown_text = PUBLIC_API_FILE.read_text(encoding="utf-8")
        except Exception as exc:
            LOGGER.warning("Cannot read PUBLIC_API.md: %s", exc)
        return render_template(
            "api_docs.html",
            active_tab="api_docs",
            page_title="Public API",
            api_markdown=markdown_text,
        )

    @app.get("/lan-network")
    @app.get("/lan-sites")
    def lan_sites_page() -> Any:
        return render_template("lan_sites.html", active_tab="lan_sites", page_title="Lan Network")

    @app.get("/printagent")
    def printagent_page() -> Any:
        return redirect(url_for("agents_page"))

    @app.get("/printers")
    def printers_page() -> Any:
        return render_template("printers_dashboard.html", active_tab="printers", page_title="Printers")

    @app.get("/counter")
    def counter_page() -> Any:
        return render_template("counter.html", active_tab="counter", page_title="Counter Infor")

    @app.get("/status")
    def status_page() -> Any:
        return render_template("status.html", active_tab="status", page_title="Status Infor")

    @app.get("/heatmap")
    def heatmap_page() -> Any:
        return render_template("heatmap.html", active_tab="heatmap", page_title="Heatmap")

    @app.get("/health")
    def health_page() -> Any:
        return render_template("health.html", active_tab="health", page_title="Health Monitor")

    @app.get("/scan-points")
    def scan_points_page() -> Any:
        return render_template("scan_points.html", active_tab="scan_points", page_title="Scan Points")

    @app.get("/copier-auths")
    def copier_auths_page() -> Any:
        return render_template("copier_auths.html", active_tab="copier_auths", page_title="Copier Auths")

    @app.get("/uticommands")
    def uticommands_page() -> Any:
        return render_template("uticommands.html", active_tab="uticommands", page_title="Uti Commands")

    @app.get("/jobs")
    def jobs_page() -> Any:
        return render_template("jobs.html", active_tab="jobs", page_title="Job Manager")

    @app.get("/public-ips")
    def public_ips_page() -> Any:
        return redirect(url_for("lan_sites_page") + "?tab=public-ips")

