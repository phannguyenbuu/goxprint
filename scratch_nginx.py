import subprocess
import base64

nginx_conf = """server {
    server_name app.goxprint.com;
    root /var/www/app-gox;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }

    location /assets/ {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location /api {
        proxy_pass http://127.0.0.1:8005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/app.goxprint.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.goxprint.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = app.goxprint.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name app.goxprint.com;
    return 404;
}

server {
    listen 443 ssl http2;
    server_name *.app.goxprint.com;

    ssl_certificate /etc/letsencrypt/live/app.goxprint.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.goxprint.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 100M;

    location / {
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

server {
    listen 80;
    server_name *.app.goxprint.com;
    return 301 https://$host$request_uri;
}
"""

b64 = base64.b64encode(nginx_conf.encode('utf-8')).decode('utf-8')
cmd = ['ssh', '-i', r'C:\Users\nguyenbuu.DESKTOP-TOEFTR1\.ssh\id_ed25519', 'root@157.66.80.125', f'echo {b64} | base64 -d > /etc/nginx/sites-available/app.goxprint.com && nginx -t && systemctl reload nginx']
res = subprocess.run(cmd, capture_output=True, text=True)
print('STDOUT:', res.stdout)
print('STDERR:', res.stderr)
