import json
from pathlib import Path

brain_dir = Path(r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.gemini\antigravity\brain")

for conv_dir in brain_dir.iterdir():
    if not conv_dir.is_dir():
        continue
    
    for fname in ["transcript.jsonl", "transcript_full.jsonl"]:
        transcript_path = conv_dir / ".system_generated" / "logs" / fname
        if transcript_path.exists():
            try:
                with open(transcript_path, "r", encoding="utf-8") as f:
                    for line in f:
                        data = json.loads(line)
                        content = data.get("content", "")
                        tool_calls = str(data.get("tool_calls", ""))
                        combined = (str(content) + " " + tool_calls).lower()
                        if "ok1.pdf" in combined:
                            print(f"Conv {conv_dir.name} File {fname} Step {data.get('step_index')}: {combined[:200]}...")
            except Exception as e:
                pass
