#!/bin/bash

# BintuBot Live Streaming Setup Script
# Works on both VPS (Ubuntu/Debian) and Termux
# Author: BintuBot Team

set -e

echo "🚀 BintuBot Live Streaming Setup Starting..."
echo "=============================================="

# Detect environment
if [[ "$PREFIX" == *"com.termux"* ]]; then
    ENVIRONMENT="termux"
    PACKAGE_MANAGER="pkg"
    echo "📱 Detected: Termux environment"
else
    ENVIRONMENT="vps"
    PACKAGE_MANAGER="apt"
    echo "🖥️  Detected: VPS/Ubuntu/Debian environment"
fi

# Update and upgrade packages
echo ""
echo "📦 Updating and upgrading packages..."
if [ "$ENVIRONMENT" = "termux" ]; then
    pkg update && pkg upgrade -y
else
    apt update && apt upgrade -y
fi

# Install required packages
echo ""
echo "📦 Installing required packages (nodejs, ffmpeg, git)..."
if [ "$ENVIRONMENT" = "termux" ]; then
    pkg install -y nodejs npm ffmpeg git
else
    # Install Node.js via NodeSource repository for VPS
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs ffmpeg git
fi

# Verify installations
echo ""
echo "✅ Verifying installations..."
node --version
npm --version
ffmpeg -version | head -1
git --version

# Install PM2 globally
echo ""
echo "📦 Installing PM2 globally..."
npm install -g pm2

# Set up project directory
PROJECT_DIR="live-stream-pilot-project"
REPO_URL="https://github.com/replybintunet/live-stream-pilot-project.git"

echo ""
echo "📁 Setting up project directory..."

if [ -d "$PROJECT_DIR" ]; then
    echo "📂 Project directory exists, pulling latest changes..."
    cd $PROJECT_DIR
    git pull origin main || git pull origin master
else
    echo "📂 Cloning repository..."
    echo "⚠️  Note: Update the REPO_URL in this script with your actual repository URL"
    echo "For now, creating project structure manually..."
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    
    # Initialize git if needed
    if [ ! -d ".git" ]; then
        git init
        echo "Git repository initialized. Add your remote origin manually:"
        echo "git remote add origin YOUR_REPO_URL"
    fi
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
if [ -f "package.json" ]; then
    npm install
else
    echo "⚠️  package.json not found in root. Make sure you're in the correct directory."
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    cd backend
    npm install
    cd ..
else
    echo "⚠️  Backend directory or package.json not found."
fi

# Build frontend
echo ""
echo "🔨 Building frontend..."
if [ -f "package.json" ]; then
    npm run build
else
    echo "⚠️  Cannot build frontend - package.json not found."
fi

# Set permissions
echo ""
echo "🔒 Setting permissions..."
if [ "$ENVIRONMENT" = "vps" ]; then
    chmod +x backend/server.js 2>/dev/null || echo "backend/server.js not found, skipping chmod"
fi

# Create startup scripts for convenience
echo ""
echo "📝 Creating convenience scripts..."

# Create start-frontend.sh
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting BintuBot Frontend (Development)..."
npm run dev
EOF
chmod +x start-frontend.sh

# Create start-backend.sh
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting BintuBot Backend..."
cd backend
npm run dev
EOF
chmod +x start-backend.sh

# Create start-production.sh
cat > start-production.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting BintuBot in Production Mode..."
cd backend
pm2 start server.js --name "bintubot-backend"
echo "✅ BintuBot backend started with PM2"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs bintubot-backend"
EOF
chmod +x start-production.sh

echo ""
echo "🎉 Setup completed successfully!"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""

if [ "$ENVIRONMENT" = "termux" ]; then
    echo "🔧 For Development (Termux):"
    echo "  1. Start backend:  ./start-backend.sh"
    echo "  2. Start frontend: ./start-frontend.sh (in new session)"
    echo "  3. Open browser:   http://localhost:8080"
    echo ""
    echo "📱 Termux Tips:"
    echo "  - Use 'termux-wake-lock' to prevent sleeping"
    echo "  - Install 'termux-api' for better functionality"
    echo "  - Frontend runs on port 8080, backend on 3001"
else
    echo "🔧 For Development (VPS):"
    echo "  1. Start backend:  ./start-backend.sh"
    echo "  2. Start frontend: ./start-frontend.sh (in new terminal)"
    echo "  3. Open browser:   http://YOUR_VPS_IP:8080"
    echo ""
    echo "🚀 For Production (VPS):"
    echo "  1. Start production: ./start-production.sh"
    echo "  2. Access app:       http://YOUR_VPS_IP (port 80)"
    echo ""
    echo "🔍 Production Management:"
    echo "  - Check status:      pm2 status"
    echo "  - View logs:         pm2 logs bintubot-backend"
    echo "  - Restart:           pm2 restart bintubot-backend"
    echo "  - Stop:              pm2 stop bintubot-backend"
fi

echo ""
echo "⚙️  Environment detected: $ENVIRONMENT"
echo "📦 Package manager used: $PACKAGE_MANAGER"
echo ""
echo "🔗 Useful Commands:"
echo "  - Check Node version: node --version"
echo "  - Check FFmpeg:       ffmpeg -version"
echo "  - PM2 monitoring:     pm2 monit"
echo ""
echo "📚 Documentation:"
echo "  - README.md contains detailed deployment instructions"
echo "  - Check backend/server.js for API endpoints"
echo ""
echo "🎯 Ready to stream with BintuBot! 🤖"
