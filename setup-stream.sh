#!/data/data/com.termux/files/usr/bin/bash

echo "🔷 Updating system…"
pkg update && pkg upgrade -y || sudo apt update && sudo apt upgrade -y

echo "🔷 Installing required packages…"
pkg install nodejs ffmpeg git -y || sudo apt install -y nodejs ffmpeg git

echo "🔷 Installing PM2 globally…"
npm install -g pm2

cd ~

if [ -d "live-stream-pilot-project" ]; then
  echo "⚠️ Directory exists. Pulling latest changes…"
  cd live-stream-pilot-project
  git pull
else
  echo "🔷 Cloning project…"
  git clone https://github.com/replybintunet/live-stream-pilot-project.git
  cd live-stream-pilot-project
fi

echo "🔷 Installing frontend dependencies…"
npm install

echo "🔷 Installing backend dependencies…"
cd backend
npm install
cd ..

echo "🔷 Done. You can now run servers:"

echo ""
echo "🟢 Start backend:"
echo "cd ~/live-stream-pilot-project/backend && pm2 start server.js --name youtube-stream-backend"
echo ""
echo "🟢 Start frontend:"
echo "cd ~/live-stream-pilot-project && npm run dev"
echo ""
echo "🌐 Open browser: http://<your-ip>:5173/"
echo "ℹ️ Find IP: ip addr show wlan0 | grep inet"
echo ""
echo "🎥 Happy streaming!"