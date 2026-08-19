from __future__ import annotations
import logging

LOGGER = logging.getLogger(__name__)

class PollingScanPointsMixin:
    """Dummy mixin - Native scan points polling removed.
    Scan point CRUD is handled via standalone utility scripts.
    """
    def _run_scan_cycle(self, *args, **kwargs):
        pass
