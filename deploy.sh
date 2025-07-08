#!/bin/bash

# YouTube Live Streaming App Deployment Script
# Run this script on your VPS (34.127.16.135) as root

set -e

echo "🚀 Starting YouTube Live Streaming App Deployment..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js (using NodeSource repository)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install FFmpeg
echo "📦 Installing FFmpeg..."
apt-get install -y ffmpeg

# Verify installations
echo "✅ Verifying installations..."
node --version
npm --version
ffmpeg -version

# Create application directory
APP_DIR="/opt/youtube-streaming"
echo "📁 Creating application directory at $APP_DIR..."
mkdir -p $APP_DIR
cd $APP_DIR

# Copy application files (you'll need to upload these manually)
echo "📋 Application files should be uploaded to $APP_DIR"
echo "Expected structure:"
echo "  ├── backend/"
echo "  ├── dist/ (built frontend)"
echo "  ├── package.json"
echo "  └── ecosystem.config.js"

# Install PM2 for process management
echo "📦 Installing PM2..."
npm install -g pm2

# Create systemd service file
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/youtube-streaming.service << 'EOF'
[Unit]
Description=YouTube Live Streaming App
After=network.target

[Service]
Type=forking
User=root
WorkingDirectory=/opt/youtube-streaming
ExecStart=/usr/bin/pm2 start ecosystem.config.js --env production
ExecReload=/usr/bin/pm2 reload ecosystem.config.js --env production
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
PIDFile=/root/.pm2/pm2.pid
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create PM2 ecosystem file
echo "🔧 Creating PM2 ecosystem configuration..."
cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'youtube-streaming',
    script: 'backend/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 80
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    },
    log_file: '/var/log/youtube-streaming.log',
    error_file: '/var/log/youtube-streaming-error.log',
    out_file: '/var/log/youtube-streaming-out.log',
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

# Set up log directory
mkdir -p /var/log
touch /var/log/youtube-streaming.log
touch /var/log/youtube-streaming-error.log
touch /var/log/youtube-streaming-out.log

# Set permissions
echo "🔒 Setting permissions..."
chown -R root:root $APP_DIR
chmod +x $APP_DIR/backend/server.js

# Enable and start systemd service
echo "🚀 Enabling and starting service..."
systemctl daemon-reload
systemctl enable youtube-streaming
systemctl start youtube-streaming

# Check service status
echo "📊 Service status:"
systemctl status youtube-streaming --no-pager

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔧 Useful commands:"
echo "  Start service:   systemctl start youtube-streaming"
echo "  Stop service:    systemctl stop youtube-streaming"
echo "  Restart service: systemctl restart youtube-streaming"
echo "  View logs:       pm2 logs youtube-streaming"
echo "  Check status:    pm2 status"
echo ""
echo "🌐 Your app will be available at: http://34.127.16.135"
echo ""
echo "🔍 Troubleshooting:"
echo "  View service logs: journalctl -u youtube-streaming -f"
echo "  Check PM2 status:  pm2 status"
echo "  Monitor processes: pm2 monit"