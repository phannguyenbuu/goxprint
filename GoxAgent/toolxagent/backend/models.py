from __future__ import annotations

from datetime import datetime, timezone
import uuid
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, Boolean, BigInteger
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    
    documents: Mapped[list[Document]] = relationship("Document", back_populates="user", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    
    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    dpi: Mapped[int] = mapped_column(Integer, default=300)
    colorspace: Mapped[str] = mapped_column(String(32), default="rgb")  # rgb, cmyk
    compression: Mapped[str] = mapped_column(String(32), default="lzw")  # lzw, deflate, none
    profile: Mapped[str] = mapped_column(String(100), default="sRGB Color Space Profile.icm")
    max_pixels: Mapped[int] = mapped_column(BigInteger, default=1000000000)
    
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)  # pending, rendering, completed, failed
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    original_path: Mapped[str] = mapped_column(String(500), nullable=False)
    rendered_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    preview_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    convert_to_pdf: Mapped[bool] = mapped_column(Boolean, default=False)
    
    user: Mapped[User] = relationship("User", back_populates="documents")

from sqlalchemy import JSON

class Release(Base):
    __tablename__ = "releases"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    version: Mapped[str] = mapped_column(String(32), nullable=False, unique=True, index=True)
    download_url: Mapped[str] = mapped_column(String(500), nullable=False)
    sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    core_version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    core_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    core_sha256: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

class Diagnostic(Base):
    __tablename__ = "diagnostics"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    hostname: Mapped[str] = mapped_column(String(100), nullable=False)
    agent_version: Mapped[str] = mapped_column(String(32), nullable=False)
    core_version: Mapped[str] = mapped_column(String(32), nullable=False)
    cpu_usage: Mapped[float] = mapped_column(nullable=False, default=0.0)
    ram_used_gb: Mapped[float] = mapped_column(nullable=False, default=0.0)
    ram_total_gb: Mapped[float] = mapped_column(nullable=False, default=0.0)
    is_online: Mapped[bool] = mapped_column(Boolean, default=True)
    last_heartbeat_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    stout_logs: Mapped[str | None] = mapped_column(Text, nullable=True)
    sterror_logs: Mapped[str | None] = mapped_column(Text, nullable=True)
    settings_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    system_info: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    pending_command: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    user: Mapped[User] = relationship("User")
