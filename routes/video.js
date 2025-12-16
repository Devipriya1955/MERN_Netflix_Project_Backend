import express from 'express';
import multer from 'multer';
import Movie from '../models/Movie.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload video to movie
router.post('/upload/:movieId', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.videoData = req.file.buffer;
    movie.videoContentType = req.file.mimetype;
    await movie.save();

    res.json({ message: 'Video uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stream video
router.get('/stream/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie || !movie.videoData) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const range = req.headers.range;
    const videoSize = movie.videoData.length;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': movie.videoContentType,
      });

      res.end(movie.videoData.slice(start, end + 1));
    } else {
      res.writeHead(200, {
        'Content-Length': videoSize,
        'Content-Type': movie.videoContentType,
      });
      res.end(movie.videoData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;