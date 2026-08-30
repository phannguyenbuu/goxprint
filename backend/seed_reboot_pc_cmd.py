from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand

def seed_reboot_pc_command():
    print("Seeding restart_pc utility command into Database...")
    cmd_name = "restart_pc"
    label = "🔄 Buộc khởi động lại Máy tính (Restart PC)"
    icon = "🔄"
    category = "System"
    description = "Buộc khởi động lại hệ điều hành Windows trên máy tính Agent sau 5 giây."
    
    script_content = """import subprocess, sys, os
_NO_WIN = 0x08000000 if sys.platform == 'win32' else 0
print("=== THỰC THI LỆNH BUỘC KHỞI ĐỘNG LẠI MÁY TÍNH WINDOWS ===")
try:
    if sys.platform == 'win32':
        res = subprocess.run(["shutdown.exe", "/r", "/t", "5", "/f", "/c", "Buoc khoi dong lai may tinh theo yeu cau tu PrintAgent"], capture_output=True, text=True, creationflags=_NO_WIN)
        print("Đã phát lệnh khởi động lại Windows sau 5 giây!")
        print(res.stdout or res.stderr or "Lệnh shutdown.exe /r /t 5 /f đã được gửi thành công.")
    else:
        res = subprocess.run(["sudo", "reboot"], capture_output=True, text=True)
        print(res.stdout or res.stderr or "Lệnh reboot đã được gửi.")
except Exception as e:
    print(f"Lỗi khi gửi lệnh reboot: {e}")
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
        print("Done seeding restart_pc command into DB.")
    finally:
        session.close()

if __name__ == "__main__":
    seed_reboot_pc_command()
