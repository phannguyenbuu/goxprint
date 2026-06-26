#!/bin/bash
curl -sL 'https://agentapi.quanlymay.com/api/agents?lead=default' | python3 -c "
import json, sys
raw = sys.stdin.read()
print('RAW response (first 2000 chars):')
print(raw[:2000])
"
