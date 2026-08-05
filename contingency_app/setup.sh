#!/bin/bash



# Exit immediately if a command exits with a non-zero status

set -e



echo "Updating packages..."

export DEBIAN_FRONTEND=noninteractive

apt-get update

apt-get install -y python3-venv python3-pip nginx certbot python3-certbot-nginx



echo "Setting up virtual environment and dependencies..."

cd /var/www/cpdp_app

python3 -m venv venv

./venv/bin/pip install -r requirements.txt



echo "Setting up systemd service for Gunicorn..."

cat > /etc/systemd/system/cpdp_app.service << 'EOF'

[Unit]

Description=Gunicorn instance to serve cpdp_app

After=network.target



[Service]

User=root

Group=www-data

WorkingDirectory=/var/www/cpdp_app

Environment="PATH=/var/www/cpdp_app/venv/bin"

ExecStart=/var/www/cpdp_app/venv/bin/gunicorn --workers 3 --bind unix:cpdp_app.sock -m 007 app:app



[Install]

WantedBy=multi-user.target

EOF



systemctl daemon-reload

systemctl stop cpdp_app || true

systemctl start cpdp_app

systemctl enable cpdp_app



echo "Setting up Nginx..."

cat > /etc/nginx/sites-available/cpdp.n-lux.com << 'EOF'

server {

    listen 80;

    server_name cpdp.n-lux.com;



    location / {

        include proxy_params;

        proxy_pass http://unix:/var/www/cpdp_app/cpdp_app.sock;

    }

}

EOF



ln -sf /etc/nginx/sites-available/cpdp.n-lux.com /etc/nginx/sites-enabled/

rm -f /etc/nginx/sites-enabled/default

nginx -t

systemctl restart nginx



echo "Running Certbot for SSL..."

certbot --nginx -d cpdp.n-lux.com --non-interactive --agree-tos -m admin@n-lux.com --redirect



echo "Setup Complete!"