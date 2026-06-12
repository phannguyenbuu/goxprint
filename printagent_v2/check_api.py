import requests
r = requests.get('https://goxprint.com/api/lan-sites?lead=goxprint', timeout=10)
print(f"Status: {r.status_code}")
print(f"Content-Type: {r.headers.get('Content-Type','')}")
print(f"Body (first 500): {r.text[:500]}")
