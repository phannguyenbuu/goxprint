scp -o StrictHostKeyChecking=no D:\Dropbox\_Documents\Goxprint\GoxAgent\agent\utils\scanner.py root@100.73.10.37:/opt/GoxAgent/agent/utils/scanner.py
ssh -o StrictHostKeyChecking=no root@100.73.10.37 "systemctl restart goxagent"
echo "Done!"
