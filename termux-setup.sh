#!/data/data/com.termux/files/usr/bin/bash

# BintuBot Clean Termux Setup Script
# For fresh Termux installations on Android
# Copy-paste and run this script in Termux

set -e

echo "🤖 BintuBot Termux Setup"
echo "========================"
echo "Setting up BintuBot on fresh Termux installation..."
echo ""

# Step 1: Setup storage access
echo "📱 Setting up storage access..."
termux-setup-storage
echo "✅ Storage access configured"
echo ""

# Step 2: Update Termux packages
echo "📦 Updating Termux packages..."
pkg update -y && pkg upgrade -y
echo "✅ Packages updated"
echo ""

# Step 3: Install required packages
echo "📦 Installing required packages..."
pkg install -y nodejs npm git ffmpeg python
echo "✅ Required packages installed"
echo ""

# Step 4: Install PM2 globally
echo "🔧 Installing PM2 process manager..."
npm install -g pm2
echo "✅ PM2 installed"
echo ""

# Step 5: Clone repository
echo "📥 Cloning BintuBot repository..."
if [ -d "live-stream-pilot-project" ]; then
    echo "Repository exists, updating..."
    cd live-stream-pilot-project
    git pull origin main || git pull origin master
else
    git clone https://github.com/replybintunet/live-stream-pilot-project.git
    cd live-stream-pilot-project
fi
echo "✅ Repository ready"
echo ""

# Step 6: Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Step 7: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Step 8: Build frontend
echo "🔨 Building frontend..."
npm run build
echo "✅ Frontend built"
echo ""

# Step 9: Create convenience scripts
echo "📝 Creating startup scripts..."

# Backend script
cat > start-backend.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
echo "🚀 Starting BintuBot Backend..."
cd ~/live-stream-pilot-project/backend
npm run dev
EOF
chmod +x start-backend.sh

# Frontend script  
cat > start-frontend.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
echo "🚀 Starting BintuBot Frontend..."
cd ~/live-stream-pilot-project
npm run dev
EOF
chmod +x start-frontend.sh

# Production script
cat > start-production.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
echo "🚀 Starting BintuBot Production..."
cd ~/live-stream-pilot-project/backend
pm2 start server.js --name "bintubot"
echo "✅ BintuBot started in background"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs bintubot"
EOF
chmod +x start-production.sh

echo "✅ Startup scripts created"
echo ""

# Step 10: Setup wake lock
echo "⚡ Enabling wake lock to prevent sleep..."
termux-wake-lock
echo "✅ Wake lock enabled"
echo ""

echo "🎉 BintuBot Setup Complete!"
echo "=========================="
echo ""
echo "📱 Next Steps:"
echo ""
echo "1️⃣  Start Backend (in current session):"
echo "   ./start-backend.sh"
echo ""
echo "2️⃣  Start Frontend (swipe left → new session):"
echo "   ./start-frontend.sh"
echo ""
echo "3️⃣  Open browser and visit:"
echo "   http://localhost:8080"
echo ""
echo "🚀 For Production Mode:"
echo "   ./start-production.sh"
echo ""
echo "📋 Useful Commands:"
echo "   - Check processes: pm2 status"
echo "   - View logs: pm2 logs bintubot"
echo "   - Stop all: pm2 stop all"
echo "   - Restart: pm2 restart bintubot"
echo ""
echo "💡 Termux Tips:"
echo "   - Keep this session open for backend"
echo "   - Swipe from left edge for new session"
echo "   - Keep device plugged in for long streams"
echo "   - Wake lock is already enabled"
echo ""
echo "🤖 Ready to stream with BintuBot!"