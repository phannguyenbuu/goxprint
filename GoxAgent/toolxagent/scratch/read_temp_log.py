import os

temp_dirs = [
    os.environ.get("TEMP", ""),
    r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\AppData\Local\Temp",
    r"C:\Users\NGUYEN~1.DES\AppData\Local\Temp"
]
log_file = None
for td in temp_dirs:
    if td:
        candidate = os.path.join(td, "Toolx", "stdout.txt")
        if os.path.exists(candidate):
            log_file = candidate
            break

if log_file:
    with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        print("Last 15 lines of agent stdout log:")
        lines = content.splitlines()
        for line in lines[-15:]:
            print(line)
else:
    print(f"Log file not found at {log_file}")
