from __future__ import annotations

from config import ServerConfig
from db import create_session_factory
from models import Base
from sqlalchemy import text


def main() -> None:
    cfg = ServerConfig()
    session_factory = create_session_factory(cfg)
    bind = session_factory.kw["bind"]
    Base.metadata.create_all(bind=bind)
    # Base.metadata.create_all creates all new tables including ScanEmailAlias (added v1.4.48)
    
    with bind.connect() as conn:
        conn.execute(text('ALTER TABLE "LanEmail" ADD COLUMN IF NOT EXISTS email_type VARCHAR(32) DEFAULT \'common\''))
        conn.execute(text('ALTER TABLE "LanEmail" ADD COLUMN IF NOT EXISTS pc_name VARCHAR(255) DEFAULT \'\''))
        conn.execute(text('ALTER TABLE "PrinterControlCommand" ADD COLUMN IF NOT EXISTS command_params TEXT DEFAULT \'\''))
        conn.execute(text('ALTER TABLE "PrinterControlCommand" ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE DEFAULT NULL'))
        conn.execute(text('ALTER TABLE "AgentNode" ADD COLUMN IF NOT EXISTS scan_auto_open_file BOOLEAN DEFAULT TRUE'))
        conn.execute(text('ALTER TABLE "AgentNode" ADD COLUMN IF NOT EXISTS scan_auto_open_dir BOOLEAN DEFAULT TRUE'))
        conn.execute(text("ALTER TABLE \"AgentNode\" ADD COLUMN IF NOT EXISTS gds_status VARCHAR(32) DEFAULT 'unknown'"))
        conn.execute(text('ALTER TABLE "AgentPresenceLog" ADD COLUMN IF NOT EXISTS scan_auto_open_file BOOLEAN DEFAULT TRUE'))
        conn.execute(text('ALTER TABLE "AgentPresenceLog" ADD COLUMN IF NOT EXISTS scan_auto_open_dir BOOLEAN DEFAULT TRUE'))
        conn.commit()
        
    print("Database initialized:", cfg.database_url)



if __name__ == "__main__":
    main()
