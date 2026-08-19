import os
import sys
import time
import requests
import subprocess
from pathlib import Path

SERVER_URL = "https://render.toolxprint.com"
PDF_FILE = r"D:\Dropbox\_Documents\Goxprint\printagent_v2\backend\static\scans\default_B0_8B_92_4B_99_DD_192_168_1_1\phannguyenbuugmail.com\HTX_Compiled_Documents.pdf"

def main():
    if not os.path.exists(PDF_FILE):
        print(f"Error: Sample PDF not found at {PDF_FILE}")
        return
        
    print("=== STARTING AUTOMATED E2E VERIFICATION ===")
    
    session = requests.Session()
    
    # 1. Register test user
    username = f"user_{int(time.time())}"
    password = "password123"
    print(f"Registering user: {username}...")
    try:
        res = session.post(f"{SERVER_URL}/register", data={
            "username": username,
            "password": password
        }, allow_redirects=False)
        print(f"Registration response status: {res.status_code}")
    except Exception as e:
        print(f"Registration failed: {e}")
        return
        
    # 2. Login
    print("Logging in...")
    try:
        res = session.post(f"{SERVER_URL}/login", data={
            "username": username,
            "password": password
        }, allow_redirects=False)
        print(f"Login response status: {res.status_code}")
    except Exception as e:
        print(f"Login failed: {e}")
        return
        
    # 3. Start toolxagent.exe in the background
    agent_path = r"dist\toolxagent_v1.4.4.exe"
    if not os.path.exists(agent_path):
        print(f"Error: Compiled agent not found at {agent_path}")
        return
        
    print("Starting toolxagent.exe in background...")
    abs_agent_path = str(Path(agent_path).resolve())
    agent_proc = subprocess.Popen([abs_agent_path], cwd="dist")
    
    # Wait for the agent to start and clear any old queue
    print("Waiting 10 seconds for agent to start and clean queue...")
    time.sleep(10)
    
    # 4. Upload file
    print("Uploading PDF file for rendering (300 DPI, CMYK, LZW)...")
    try:
        with open(PDF_FILE, "rb") as f:
            res = session.post(f"{SERVER_URL}/upload", data={
                "dpi": 300,
                "colorspace": "cmyk",
                "compression": "lzw",
                "convert_to_pdf": "on"
            }, files={
                "file": (os.path.basename(PDF_FILE), f, "application/pdf")
            }, allow_redirects=False)
        print(f"Upload response status: {res.status_code}")
    except Exception as e:
        print(f"Upload failed: {e}")
        return
    
    # 5. Monitor status of the render task
    print("Monitoring rendering task status...")
    max_wait = 180  # 3 minutes maximum
    start_time = time.time()
    task_completed = False
    
    try:
        while time.time() - start_time < max_wait:
            # Check the DB or poll agent status via API
            # Let's get the list of documents for current user
            # Flask UI '/' route returns documents.
            # We can check `/api/agent/poll` to see if there is any pending task, or use another check.
            # Let's request the main index page and check if it contains "Hoàn thành"
            res = session.get(SERVER_URL)
            html = res.text
            
            if "Hoàn thành" in html:
                print("\n[SUCCESS] Render task completed successfully on VPS!")
                task_completed = True
                break
            elif "Thất bại" in html:
                print("\n[FAILURE] Render task reported failure on VPS.")
                break
            elif "Đang render" in html:
                sys.stdout.write("R")
            else:
                sys.stdout.write(".")
            sys.stdout.flush()
            time.sleep(5)
            
    finally:
        # Terminate agent
        print("\nTerminating toolxagent.exe process...")
        agent_proc.terminate()
        agent_proc.wait()
        
    if task_completed:
        print("\n=== E2E VERIFICATION COMPLETED WITH SUCCESS ===")
    else:
        print("\n=== E2E VERIFICATION FAILED OR TIMED OUT ===")
        sys.exit(1)

if __name__ == "__main__":
    main()
