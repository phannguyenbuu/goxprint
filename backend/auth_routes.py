from __future__ import annotations

import base64
import hashlib
import json
import logging
import os
from typing import Any

from flask import Flask, jsonify, redirect, render_template, request, url_for
from sqlalchemy import select

from jwt_auth import (
    COOKIE_NAME,
    JWT_EXPIRATION_SECONDS,
    authenticate_user,
    create_auth_token,
    verify_auth_token,
)
from models import UserAccount, UserType
from serializers import _serialize_user_model, _user_type_value
from utils import _to_text

LOGGER = logging.getLogger(__name__)


def register_auth_routes(app: Flask, session_factory: Any) -> None:

    @app.route("/login", methods=["GET", "POST"])
    def login_page() -> Any:
        # Check if already authenticated via cookie or auth header
        existing_token = request.cookies.get(COOKIE_NAME)
        if not existing_token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                existing_token = auth_header[7:].strip()

        if existing_token and verify_auth_token(existing_token):
            next_target = request.args.get("next") or request.form.get("next") or ""
            if not next_target or next_target.strip() in ("/login", ""):
                next_target = url_for("dashboard")
            return redirect(next_target)

        if request.method == "GET":
            next_url = request.args.get("next", "")
            return render_template("login.html", error=None, username="gox", next_url=next_url)

        # POST request: process login submission
        username = ""
        password = ""

        if request.is_json:
            body = request.get_json(silent=True) or {}
            username = _to_text(body.get("username") or body.get("email"))
            password = _to_text(body.get("password"))
            next_target = _to_text(body.get("next"))
        else:
            username = _to_text(request.form.get("username"))
            password = _to_text(request.form.get("password"))
            next_target = _to_text(request.form.get("next") or request.args.get("next"))

        if not next_target or next_target.strip() in ("/login", ""):
            next_target = url_for("dashboard")

        is_ok, user_data = authenticate_user(session_factory, username, password)

        if not is_ok or not user_data:
            err_msg = "Tên đăng nhập hoặc mật khẩu không chính xác."
            if request.is_json:
                return jsonify({"ok": False, "error": err_msg}), 401
            return render_template("login.html", error=err_msg, username=username, next_url=next_target), 401

        # Generate 30-day JWT token
        token = create_auth_token(
            username=user_data["username"],
            role=user_data.get("role", "admin"),
            lead=user_data.get("lead", "default"),
            extra={"user_id": user_data.get("id"), "email": user_data.get("email")},
        )

        LOGGER.info("User '%s' logged in successfully. Issued 30-day JWT.", user_data["username"])

        if request.is_json:
            response = jsonify({
                "ok": True,
                "token": token,
                "expires_in": JWT_EXPIRATION_SECONDS,
                "user": user_data,
            })
        else:
            response = redirect(next_target)

        # Set 30-day cookie
        response.set_cookie(
            COOKIE_NAME,
            token,
            max_age=JWT_EXPIRATION_SECONDS,
            httponly=True,
            samesite="Lax",
            path="/",
        )
        return response

    @app.route("/logout", methods=["GET", "POST"])
    def logout_page() -> Any:
        response = redirect(url_for("login_page"))
        response.set_cookie(COOKIE_NAME, "", max_age=0, expires=0, path="/")
        return response

    @app.post("/api/login")
    def api_login() -> Any:
        body = request.get_json(silent=True) or {}
        username_or_email = _to_text(body.get("username") or body.get("email"))
        password = _to_text(body.get("password"))
        if not username_or_email or not password:
            return jsonify({"ok": False, "error": "Email/Username and password are required"}), 400

        is_ok, user_data = authenticate_user(session_factory, username_or_email, password)
        if not is_ok or not user_data:
            return jsonify({"ok": False, "error": "Invalid username or password"}), 401

        token = create_auth_token(
            username=user_data["username"],
            role=user_data.get("role", "admin"),
            lead=user_data.get("lead", "default"),
            extra={"user_id": user_data.get("id"), "email": user_data.get("email")},
        )

        resp = jsonify({
            "ok": True,
            "token": token,
            "expires_in": JWT_EXPIRATION_SECONDS,
            "user": user_data,
        })
        resp.set_cookie(
            COOKIE_NAME,
            token,
            max_age=JWT_EXPIRATION_SECONDS,
            httponly=True,
            samesite="Lax",
            path="/",
        )
        return resp

    @app.post("/api/login/google")
    def api_login_google() -> Any:
        body = request.get_json(silent=True) or {}
        token = body.get("token")
        if not token:
            return jsonify({"ok": False, "error": "Missing Google token"}), 400

        try:
            parts = token.split(".")
            if len(parts) != 3:
                raise ValueError("Invalid token format")
            payload = json.loads(base64.b64decode(parts[1] + "==").decode("utf-8"))
            email = payload.get("email")
            full_name = payload.get("name", email.split("@")[0])

            if not email:
                return jsonify({"ok": False, "error": "Invalid token payload"}), 400

            with session_factory() as session:
                user = session.execute(
                    select(UserAccount).where(UserAccount.email == email)
                ).scalar_one_or_none()

                if not user:
                    user = UserAccount(
                        lead="default",
                        username=email.split("@")[0],
                        email=email,
                        full_name=full_name,
                        password=hashlib.sha256(os.urandom(16)).hexdigest(),
                        user_type=UserType.TECH.value,
                        role=UserType.TECH.value,
                        is_active=True,
                        notes="Registered via Google",
                    )
                    session.add(user)
                    session.commit()
                    session.refresh(user)
                else:
                    normalized_type = _user_type_value(user)
                    if user.user_type != normalized_type or user.role != normalized_type:
                        user.user_type = normalized_type
                        user.role = normalized_type
                        session.commit()
                        session.refresh(user)

                if not user.is_active:
                    return jsonify({"ok": False, "error": "Account is disabled"}), 403

                jwt_tkn = create_auth_token(
                    username=user.username,
                    role=user.role or "admin",
                    lead=user.lead or "default",
                    extra={"user_id": user.id, "email": user.email},
                )

                resp = jsonify({
                    "ok": True,
                    "token": jwt_tkn,
                    "expires_in": JWT_EXPIRATION_SECONDS,
                    "user": _serialize_user_model(user),
                })
                resp.set_cookie(
                    COOKIE_NAME,
                    jwt_tkn,
                    max_age=JWT_EXPIRATION_SECONDS,
                    httponly=True,
                    samesite="Lax",
                    path="/",
                )
                return resp
        except Exception as e:
            return jsonify({"ok": False, "error": f"Google auth failed: {str(e)}"}), 401
