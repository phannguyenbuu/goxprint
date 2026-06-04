import urllib.request
import hashlib
import json

url = "https://agentapi.quanlymay.com/static/releases/printagent.exe"
print(f"Downloading from {url}...")
try:
    data = urllib.request.urlopen(url, timeout=30).read()
    print(f"Downloaded size: {len(data)}")
    sha = hashlib.sha256(data).hexdigest()
    print(f"Downloaded sha256: {sha}")
except Exception as e:
    print(f"Error: {e}")
