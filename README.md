# YouTube Live Streaming Web App

A complete web application for streaming MP4 videos to YouTube Live with a beautiful, mobile-friendly interface.

## Features

✅ **Clean Mobile-Friendly Interface** - React + Tailwind CSS responsive design
✅ **YouTube Stream Key Input** - Secure password field for stream keys  
✅ **MP4 File Upload** - Drag & drop or click to upload videos
✅ **Loop Video Option** - Checkbox to continuously loop the video
✅ **One-Click Streaming** - Start live stream with beautiful animations
✅ **Success Screen** - Confirmation that stream has started
✅ **Background Processing** - Streams continue even after closing the app
✅ **Auto Cleanup** - Uploaded files are automatically deleted after streaming

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- Responsive design with mobile-first approach
- Beautiful animations and transitions

**Backend:**
- Node.js + Express
- Multer for file uploads
- FFmpeg for video streaming
- PM2 for process management

## Quick Start (Development)

### Option 1: Automated Setup (Recommended)

**For VPS (Ubuntu/Debian) or Termux (Android):**
```bash
wget https://raw.githubusercontent.com/replybintunet/live-stream-pilot-project/main/setup-stream.sh
chmod +x setup-stream.sh
./setup-stream.sh
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Start development servers:**
   ```bash
   # Frontend (terminal 1)
   npm run dev
   
   # Backend (terminal 2)
   cd backend && npm run dev
   ```

3. **Visit:** `http://localhost:8080`

## Termux Setup (Android Mobile)

BintuBot can run directly on Android using Termux! Perfect for mobile streaming.

### Prerequisites
1. Install **Termux** from F-Droid (recommended) or Google Play Store
2. Install **Termux:API** for additional functionality (optional)

### Quick Termux Setup
```bash
# Update Termux packages
pkg update && pkg upgrade -y

# Install required tools
pkg install -y git wget

# Download and run setup script
wget https://raw.githubusercontent.com/replybintunet/live-stream-pilot-project/main/setup-stream.sh
chmod +x setup-stream.sh
./setup-stream.sh
```

### Running on Termux
```bash
# Start backend (session 1)
./start-backend.sh

# Start frontend (open new session with swipe from left edge)
./start-frontend.sh

# Open browser and go to: http://localhost:8080
```

### Termux Tips
- **Prevent sleep:** Run `termux-wake-lock` to keep your device awake
- **Storage access:** Script automatically runs `termux-setup-storage` 
- **Multiple sessions:** Swipe from left edge to create new session
- **Background:** Use `nohup ./start-backend.sh &` for background processes
- **Battery:** Consider keeping device plugged in for long streams

## Production Deployment on VPS

### Prerequisites
- VPS with Ubuntu/Debian
- Root access
- Minimum 2GB RAM, 1GB free disk space

### Automated Deployment

1. **Upload files to your VPS:**
   ```bash
   # On your local machine, create deployment package
   npm run build
   
   # Upload to VPS at /opt/youtube-streaming/
   scp -r . root@34.127.16.135:/opt/youtube-streaming/
   ```

2. **Run deployment script on VPS:**
   ```bash
   ssh root@34.127.16.135
   cd /opt/youtube-streaming
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Manual Deployment Steps

1. **Install dependencies:**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   
   # Install FFmpeg
   apt-get install -y ffmpeg
   
   # Install PM2
   npm install -g pm2
   ```

2. **Setup application:**
   ```bash
   mkdir -p /opt/youtube-streaming
   cd /opt/youtube-streaming
   
   # Copy your built files here
   # Install backend dependencies
   cd backend && npm install --production
   ```

3. **Create systemd service:**
   ```bash
   # Copy the systemd service file from deploy.sh
   systemctl daemon-reload
   systemctl enable youtube-streaming
   systemctl start youtube-streaming
   ```

## Usage

1. **Get YouTube Stream Key:**
   - Go to YouTube Studio
   - Select "Go Live" 
   - Copy your stream key

2. **Upload Video:**
   - Choose an MP4 file (max 2GB)
   - Optionally enable "Loop Video"

3. **Start Streaming:**
   - Enter your stream key
   - Click "Start Live Stream"
   - Your video will begin streaming to YouTube Live

## Service Management

```bash
# Start the service
systemctl start youtube-streaming

# Stop the service  
systemctl stop youtube-streaming

# Restart the service
systemctl restart youtube-streaming

# View service status
systemctl status youtube-streaming

# View application logs
pm2 logs youtube-streaming

# Monitor processes
pm2 monit
```

## API Endpoints

- `POST /api/start-stream` - Start a new stream
- `GET /api/streams` - List active streams  
- `POST /api/stop-stream/:id` - Stop a specific stream

## Configuration

The app runs on port 80 by default. To change:

1. Edit `ecosystem.config.js`
2. Update the PORT environment variable
3. Restart the service

## Troubleshooting

### Common Issues

**Stream won't start:**
- Verify YouTube stream key is correct
- Check if FFmpeg is installed: `ffmpeg -version`
- Check server logs: `pm2 logs youtube-streaming`

**File upload fails:**
- Ensure file is MP4 format
- Check file size is under 2GB
- Verify disk space: `df -h`

**Service won't start:**
- Check systemd status: `systemctl status youtube-streaming`
- Verify Node.js is installed: `node --version`
- Check port 80 isn't in use: `netstat -tulpn | grep :80`

### Log Files

- Application logs: `pm2 logs youtube-streaming`
- System logs: `journalctl -u youtube-streaming -f`
- Error logs: `/var/log/youtube-streaming-error.log`

## Security Notes

- Stream keys are handled securely (password input)
- Uploaded files are automatically cleaned up
- No persistent storage of sensitive data
- HTTPS recommended for production (add SSL certificate)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review log files for error details
3. Ensure all prerequisites are installed correctly

## License

MIT License - feel free to modify and distribute.