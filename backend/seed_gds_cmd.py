from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

def seed_gds_command():
    print("Seeding GoxDriverService utility command into Database...")
    cmd_name = "start_gds"
    label = "⚡ Bật GoxDriverService (SYSTEM)"
    icon = "⚡"
    category = "System"
    description = "Khởi chạy GoxDriverService ngầm với quyền SYSTEM để nạp Driver Windows không bị chặn UAC."
    
    script_content = """import subprocess, sys, os
_NO_WIN = 0x08000000 if sys.platform == 'win32' else 0
print("=== KIỂM TRA & KHỞI CHẠY GOXDRIVERSERVICE (SYSTEM) ===")
try:
    res = subprocess.run(["sc.exe", "query", "GoxDriverService"], capture_output=True, text=True, creationflags=_NO_WIN)
    print("Trạng thái dịch vụ hiện tại:")
    print(res.stdout or res.stderr)
    
    start_res = subprocess.run(["sc.exe", "start", "GoxDriverService"], capture_output=True, text=True, creationflags=_NO_WIN)
    print("\\nKết quả khởi chạy:")
    print(start_res.stdout or start_res.stderr)
    
    if "RUNNING" in (res.stdout or "") or "RUNNING" in (start_res.stdout or "") or "1056" in (start_res.stderr or ""):
        print("\\n✅ THÀNH CÔNG: GoxDriverService đang hoạt động (RUNNING) với quyền SYSTEM!")
    else:
        print("\\n⚠️ Dịch vụ chưa thể chạy (Cần quyền Admin khi cài đặt Agent ban đầu).")
except Exception as e:
    print(f"Lỗi khi thực thi: {e}")
"""

    engine = create_engine('postgresql+psycopg2://postgres:myPass@localhost:5432/GoPrinx')
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        existing = session.query(UtiCommand).filter(UtiCommand.command == cmd_name).first()
        if existing:
            print(f"[*] Updating existing UtiCommand: {cmd_name}")
            existing.label = label
            existing.icon = icon
            existing.category = category
            existing.description = description
            existing.command_content = script_content
            existing.output_modal = True
        else:
            print(f"[+] Inserting new UtiCommand: {cmd_name}")
            new_cmd = UtiCommand(
                command=cmd_name,
                label=label,
                icon=icon,
                category=category,
                description=description,
                command_content=script_content,
                output_modal=True
            )
            session.add(new_cmd)
        session.commit()
        print("Done seeding start_gds command into DB.")
    finally:
        session.close()

if __name__ == "__main__":
    seed_gds_command()
