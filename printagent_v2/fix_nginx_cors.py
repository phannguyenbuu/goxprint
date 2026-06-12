import paramiko
from pathlib import Path

# Nginx config: OPTIONS handled by nginx, actual requests let Flask-CORS add headers
# To avoid duplicate, use proxy_hide_header to strip Flask's header then re-add nginx's
NGINX_CONF = r"""server {
    listen 80;
    server_name agentapi.quanlymay.com;
    client_max_body_size 100M;

    location /static/ {
        proxy_pass http://127.0.0.1:8005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name agentapi.quanlymay.com;
    client_max_body_size 100M;

    ssl_certificate /etc/letsencrypt/live/agentapi.quanlymay.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agentapi.quanlymay.com/privkey.pem;

    location / {
        # Handle CORS preflight entirely in nginx
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin $http_origin always;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
            add_header Access-Control-Allow-Headers 'Authorization, Content-Type, X-API-Token, X-Lead-Token' always;
            add_header Access-Control-Allow-Credentials 'true' always;
            add_header Access-Control-Max-Age 86400 always;
            add_header Content-Length 0;
            return 204;
        }

        # Strip Flask-CORS header to avoid duplicate, then nginx re-adds it
        proxy_hide_header Access-Control-Allow-Origin;
        proxy_hide_header Access-Control-Allow-Methods;
        proxy_hide_header Access-Control-Allow-Headers;
        proxy_hide_header Access-Control-Allow-Credentials;

        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Authorization, Content-Type, X-API-Token, X-Lead-Token' always;
        add_header Access-Control-Allow-Credentials 'true' always;

        proxy_pass http://127.0.0.1:8005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
    }
}
"""

home = Path.home()
key_candidates = [
    home / ".ssh" / "id_ed25519",
    home / ".ssh" / "id_ed25519_20260422_155451",
    Path(r"C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519"),
]
key_filename = next((str(k) for k in key_candidates if k.exists()), None)

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("31.97.76.62", username="root", key_filename=key_filename)

sftp = ssh.open_sftp()
with sftp.open("/etc/nginx/sites-enabled/agentapi.quanlymay.com.conf", "w") as f:
    f.write(NGINX_CONF)
sftp.close()
print("Config written.")

_, out, err = ssh.exec_command("nginx -t && systemctl reload nginx && echo RELOADED")
print("OUT:", out.read().decode())
print("ERR:", err.read().decode(errors='replace')[-500:])
ssh.close()
