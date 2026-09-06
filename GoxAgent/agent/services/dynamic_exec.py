from __future__ import annotations

import io
import json
import logging
import sys
import time
import traceback
from typing import Any

LOGGER = logging.getLogger("agent.dynamic_exec")


def execute_dynamic_code(
    bridge: Any,
    code_content: str,
    name: str = "dynamic_exec",
    extra_context: dict[str, Any] | None = None,
    custom_globals: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Chuẩn hóa engine thực thi mã Python động (Dynamic Exec / Live Hook):
    - Chuyển hướng và bắt trọn vẹn toàn bộ log stdout / stderr (print, warning, logs)
    - Hỗ trợ gán và trả về dữ liệu qua context['result_payload'] và context['address_book_data']
    - Bắt trọn vẹn exception và format full traceback nếu có lỗi runtime/syntax
    - Tự động nhận diện các keyword lỗi chuẩn hệ thống
    - Trả về dictionary cấu trúc đầy đủ: {ok, output, result, address_book_data, error, duration_ms}
    """
    if not code_content or not str(code_content).strip():
        return {
            "ok": False,
            "output": "",
            "result": None,
            "address_book_data": None,
            "error": "Nội dung mã thực thi (code_content) rỗng.",
            "duration_ms": 0.0,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        }

    start_time = time.time()
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    captured_buffer = io.StringIO()

    context_vars: dict[str, Any] = {
        "result_payload": None,
        "address_book_data": None,
        "custom_data": {},
        **(extra_context or {}),
    }

    env_globals: dict[str, Any] = {
        "__builtins__": __builtins__,
        "bridge": bridge,
        "config": getattr(bridge, "_config", None) if bridge else None,
        "api_client": getattr(bridge, "_api_client", None) if bridge else None,
        "ricoh_service": getattr(bridge, "_ricoh_service", None) if bridge else None,
        "toshiba_service": getattr(bridge, "_toshiba_service", None) if bridge else None,
        "context": context_vars,
        "logger": LOGGER,
        **(custom_globals or {}),
    }

    is_ok = True
    error_msg = ""

    try:
        sys.stdout = captured_buffer
        sys.stderr = captured_buffer

        compiled = compile(code_content, f"<{name}>", "exec")
        exec(compiled, env_globals)  # noqa: S102
    except BaseException as exc:
        is_ok = False
        tb = traceback.format_exc()
        error_msg = f"{exc}\n{tb}"
        LOGGER.error("[DynamicExec] '%s' error: %s\n%s", name, exc, tb)
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    logs = captured_buffer.getvalue().strip()
    payload = context_vars.get("result_payload")

    if isinstance(payload, str):
        payload_str = payload
    elif payload is not None:
        try:
            payload_str = json.dumps(payload, ensure_ascii=False, indent=2)
        except Exception:
            payload_str = str(payload)
    else:
        payload_str = ""

    final_output = logs
    if payload_str.strip():
        final_output = (final_output + "\n\n" + payload_str.strip()).strip() if final_output else payload_str.strip()

    # Kiểm tra các keyword báo lỗi chuẩn của hệ thống
    err_keywords = ["[-] LỖI THỰC THI:", "[❌ LỖI CRITICAL", "SyntaxError:", "IndentationError:"]
    if any(k in final_output for k in err_keywords):
        is_ok = False

    addr_data = context_vars.get("address_book_data")
    if not addr_data and isinstance(payload, dict) and "address_list" in payload:
        addr_data = payload
    if not isinstance(addr_data, dict) or "address_list" not in addr_data:
        addr_data = None

    duration_ms = round((time.time() - start_time) * 1000, 2)

    return {
        "ok": is_ok,
        "name": name,
        "output": final_output,
        "result": payload,
        "address_book_data": addr_data,
        "error": error_msg or (final_output if not is_ok else ""),
        "duration_ms": duration_ms,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
