#!/data/data/com.termux/files/usr/bin/bash

echo "🔷 Updating Termux…"
pkg update && pkg upgrade -y

echo "🔷 Installing required packages…"
pkg install nodejs ffmpeg git -y

echo "🔷 Installing PM2 globally…"
npm install -g pm2

cd ~

if [ -d "live-stream-pilot-project" ]; then
  echo "⚠️ Directory already exists. Pulling latest changes…"
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

echo "🔷 Building frontend…"
npm run build

echo "✅ Setup complete!"
echo ""
echo "ℹ️ To start backend server:"
echo "cd ~/live-stream-pilot-project/backend && pm2 start server.js --name youtube-stream-backend"
echo ""
echo "ℹ️ To start frontend dev server:"
echo "cd ~/live-stream-pilot-project && npm run dev"
echo ""
echo "ℹ️ Then open browser at:"
echo "http://<your-ip>:5173/"
echo ""
echo "Find your IP with:"
echo "ip addr show wlan0 | grep inet"
echo ""
echo "🚀 Happy streaming! 🎥"