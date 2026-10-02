from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import UtiCommand
import os

def seed_print_test_command():
    print("Seeding print_test_page utility command into Database...")
    cmd_name = "print_test_page"
    label = "🖨️ In trang in thử (Print Test Page)"
    icon = "🖨️"
    category = "System"
    description = "Thực hiện lệnh in trang in thử (Windows Test Page) trực tiếp từ Agent tới máy in mặc định hoặc máy in theo IP/tên chỉ định."
    
    script_file = os.path.join(os.path.dirname(__file__), "print_test_page_exec.py")
    if not os.path.exists(script_file):
        # Fallback if in parent directory
        script_file = os.path.join(os.path.dirname(__file__), "..", "print_test_page_exec.py")
    
    if os.path.exists(script_file):
        with open(script_file, "r", encoding="utf-8") as f:
            script_content = f.read()
    else:
        raise FileNotFoundError(f"Cannot find print_test_page_exec.py at {script_file}")

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
            existing.is_visible = True
        else:
            print(f"[+] Inserting new UtiCommand: {cmd_name}")
            new_cmd = UtiCommand(
                command=cmd_name,
                label=label,
                icon=icon,
                category=category,
                description=description,
                command_content=script_content,
                output_modal=True,
                is_visible=True
            )
            session.add(new_cmd)
        session.commit()
        print("Done seeding print_test_page command into DB.")
    finally:
        session.close()

if __name__ == "__main__":
    seed_print_test_command()
