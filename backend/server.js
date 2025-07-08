const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.mp4`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 files are allowed'), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // 2GB limit
  }
});

// Store active streams
const activeStreams = new Map();

// Start stream endpoint
app.post('/api/start-stream', upload.single('video'), async (req, res) => {
  try {
    const { streamKey, loopVideo } = req.body;
    const videoFile = req.file;

    if (!streamKey || !videoFile) {
      return res.status(400).send('Stream key and video file are required');
    }

    const videoPath = videoFile.path;
    const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;

    // Build ffmpeg command
    const ffmpegArgs = [
      '-i', videoPath,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-b:v', '2500k',
      '-maxrate', '2500k',
      '-bufsize', '5000k',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', '44100',
      '-f', 'flv'
    ];

    // Add loop option if requested
    if (loopVideo === 'true') {
      ffmpegArgs.unshift('-stream_loop', '-1');
    }

    ffmpegArgs.push(rtmpUrl);

    console.log('Starting stream with command:', 'ffmpeg', ffmpegArgs.join(' '));

    // Start ffmpeg process
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    // Store stream info
    const streamId = Date.now().toString();
    activeStreams.set(streamId, {
      process: ffmpeg,
      videoPath: videoPath,
      streamKey: streamKey,
      startTime: new Date()
    });

    // Handle ffmpeg events
    ffmpeg.stdout.on('data', (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      
      // Clean up
      const streamInfo = activeStreams.get(streamId);
      if (streamInfo) {
        // Delete the uploaded video file
        fs.remove(streamInfo.videoPath).catch(err => 
          console.error('Error deleting video file:', err)
        );
        activeStreams.delete(streamId);
      }
    });

    ffmpeg.on('error', (error) => {
      console.error('FFmpeg error:', error);
      // Clean up on error
      const streamInfo = activeStreams.get(streamId);
      if (streamInfo) {
        fs.remove(streamInfo.videoPath).catch(err => 
          console.error('Error deleting video file:', err)
        );
        activeStreams.delete(streamId);
      }
    });

    res.json({ 
      success: true, 
      message: 'Stream started successfully',
      streamId: streamId
    });

  } catch (error) {
    console.error('Error starting stream:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      fs.remove(req.file.path).catch(err => 
        console.error('Error deleting file:', err)
      );
    }
    
    res.status(500).send('Failed to start stream: ' + error.message);
  }
});

// Get active streams
app.get('/api/streams', (req, res) => {
  const streams = Array.from(activeStreams.entries()).map(([id, info]) => ({
    id,
    streamKey: info.streamKey.substring(0, 8) + '...',
    startTime: info.startTime
  }));
  
  res.json(streams);
});

// Stop stream endpoint
app.post('/api/stop-stream/:streamId', (req, res) => {
  const { streamId } = req.params;
  const streamInfo = activeStreams.get(streamId);
  
  if (!streamInfo) {
    return res.status(404).send('Stream not found');
  }
  
  // Kill the ffmpeg process
  streamInfo.process.kill('SIGTERM');
  
  res.json({ success: true, message: 'Stream stopped' });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large');
    }
  }
  res.status(500).send(error.message);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Active streams: ${activeStreams.size}`);
});
