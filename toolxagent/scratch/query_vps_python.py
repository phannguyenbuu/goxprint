import subprocess

cmd = [
    "ssh",
    "-i", r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519",
    "root@157.66.80.125",
    "PGPASSWORD=myPass psql -h localhost -U postgres -d toolx -c \"SELECT ram_total_gb, ram_used_gb, hostname, settings_json FROM diagnostics LIMIT 1;\""
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Row count:", res.stdout.strip())
print("Error:", res.stderr.strip())
