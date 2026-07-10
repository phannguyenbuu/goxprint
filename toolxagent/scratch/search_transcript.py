import json
from pathlib import Path

transcript_path = Path(r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.gemini\antigravity\brain\9bd736b0-0ac5-4fb3-a77f-72ba8e2a3b6e\.system_generated\logs\transcript.jsonl")

if not transcript_path.exists():
    print("Transcript not found")
    exit()

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get("content", "")
            if "ok1.pdf" in str(content):
                # Print steps with ok1.pdf
                print(f"Step {data.get('step_index')}: {str(content)[:300]}...")
        except Exception as e:
            pass
