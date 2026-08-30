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

    # Seed default scanner ports (Port 9100 enabled by default)
    try:
        from models import PrinterRecognizePort
        with session_factory() as session:
            if not session.query(PrinterRecognizePort).first():
                defaults = [
                    PrinterRecognizePort(port=9100, port_type="definitive", description="RAW Print Port (Port 9100)", enabled=True),
                    PrinterRecognizePort(port=80, port_type="web", description="HTTP Web Interface", enabled=False),
                    PrinterRecognizePort(port=443, port_type="web", description="HTTPS Web Interface", enabled=False),
                    PrinterRecognizePort(port=10443, port_type="web", description="Toshiba HTTPS Web Interface", enabled=False),
                    PrinterRecognizePort(port=515, port_type="definitive", description="LPR/LPD Print Port", enabled=False),
                    PrinterRecognizePort(port=631, port_type="definitive", description="IPP Print Port", enabled=False),
                ]
                print("[OK] Seeded default PrinterRecognizePort records into DB")
    except Exception as seed_exc:
        print(f"[!] Seed PrinterRecognizePort error: {seed_exc}")

    # Seed default AllowedPublicIp rules (116.98.0.59 and * for all LANs)
    try:
        from models import AllowedPublicIp
        with session_factory() as session:
            if not session.query(AllowedPublicIp).filter_by(ip_address="116.98.0.59").first():
                session.add(AllowedPublicIp(
                    ip_address="116.98.0.59",
                    description="User Public IP (Full Access)",
                    enabled=True
                ))
            star_rule = session.query(AllowedPublicIp).filter_by(ip_address="*").first()
            if not star_rule:
                session.add(AllowedPublicIp(
                    ip_address="*",
                    description="Allow all Public IPs access to all LANs",
                    enabled=True
                ))
            else:
                star_rule.enabled = True
            session.commit()
            print("[OK] Seeded 116.98.0.59 and wildcard AllowedPublicIp rules into DB")
    except Exception as ip_exc:
        print(f"[!] Seed AllowedPublicIp error: {ip_exc}")

    # Base.metadata.create_all creates all new tables including ScanEmailAlias (added v1.4.48)
    
    alter_statements = [
        'ALTER TABLE "LanEmail" ADD COLUMN IF NOT EXISTS email_type VARCHAR(32) DEFAULT \'common\'',
        'ALTER TABLE "LanEmail" ADD COLUMN IF NOT EXISTS pc_name VARCHAR(255) DEFAULT \'\'',
        'ALTER TABLE "PrinterControlCommand" ADD COLUMN IF NOT EXISTS command_params TEXT DEFAULT \'\'',
        'ALTER TABLE "PrinterControlCommand" ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE DEFAULT NULL',
        'ALTER TABLE "AgentNode" ADD COLUMN IF NOT EXISTS scan_auto_open_file BOOLEAN DEFAULT TRUE',
        'ALTER TABLE "AgentNode" ADD COLUMN IF NOT EXISTS scan_auto_open_dir BOOLEAN DEFAULT TRUE',
        "ALTER TABLE \"AgentNode\" ADD COLUMN IF NOT EXISTS gds_status VARCHAR(32) DEFAULT 'unknown'",
        'ALTER TABLE "AgentPresenceLog" ADD COLUMN IF NOT EXISTS scan_auto_open_file BOOLEAN DEFAULT TRUE',
        'ALTER TABLE "AgentPresenceLog" ADD COLUMN IF NOT EXISTS scan_auto_open_dir BOOLEAN DEFAULT TRUE',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS lead VARCHAR(64) DEFAULT \'default\'',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS lan_uid VARCHAR(128) DEFAULT \'default\'',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS ip VARCHAR(64) DEFAULT \'\'',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS mac_address VARCHAR(64) DEFAULT \'\'',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(128) DEFAULT \'Generic\'',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS model VARCHAR(128) DEFAULT \'Camera IP\'',
        'ALTER TABLE "CameraConfig" ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT TRUE',
        'ALTER TABLE "scan_points" ADD COLUMN IF NOT EXISTS agent_uid VARCHAR(128) DEFAULT \'\'',
        'DELETE FROM "scan_points" WHERE LOWER(printer_name) LIKE \'%f671y%\' OR LOWER(printer_name) LIKE \'%router%\' OR LOWER(printer_name) LIKE \'%gateway%\' OR LOWER(printer_name) LIKE \'%modem%\'',
        'ALTER TABLE "Printer" ADD COLUMN IF NOT EXISTS last_scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NULL',
        'ALTER TABLE "LanSite" ADD COLUMN IF NOT EXISTS public_ip VARCHAR(64) DEFAULT \'\'',
        'ALTER TABLE "AgentNode" ADD COLUMN IF NOT EXISTS public_ip VARCHAR(64) DEFAULT \'\'',
        'DELETE FROM "PrinterControlCommand" WHERE command_params LIKE \'%query_device_now%\' OR command_params LIKE \'%\"is_auto\": true%\'',
    ]

    with bind.connect() as conn:
        for stmt in alter_statements:
            try:
                conn.execute(text(stmt))
                conn.commit()
            except Exception as e:
                print(f"Skipping statement {stmt[:40]}... due to: {e}")
        
    print("Database initialized:", cfg.database_url)



if __name__ == "__main__":
    main()
