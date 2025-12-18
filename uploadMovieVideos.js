import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from './models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// INSTRUCTIONS:
// 1. Create a folder: server/videos/
// 2. Place your 5 video files there with these exact names:
//    - movie1.mp4
//    - movie2.mp4
//    - movie3.mp4
//    - movie4.mp4
//    - movie5.mp4
// 3. Run: node uploadMovieVideos.js

const uploadVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get first 5 movies from trending category
    const movies = await Movie.find({ category: 'trending' }).limit(5);
    
    if (movies.length < 5) {
      console.log('Not enough movies in database. Need at least 5 movies.');
      process.exit(1);
    }

    console.log('Movies to upload videos for:');
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (ID: ${movie._id})`);
    });
    console.log('');

    // Upload videos
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const videoPath = path.join(__dirname, 'videos', `movie${i + 1}.mp4`);
      
      if (!fs.existsSync(videoPath)) {
        console.log(`❌ Video not found: ${videoPath}`);
        console.log(`   Skipping ${movie.title}\n`);
        continue;
      }

      console.log(`Uploading video for: ${movie.title}`);
      
      const videoBuffer = fs.readFileSync(videoPath);
      const videoSizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);
      
      console.log(`   File size: ${videoSizeMB} MB`);
      
      if (videoBuffer.length > 16 * 1024 * 1024) {
        console.log(`   ⚠️  WARNING: File exceeds MongoDB 16MB limit!`);
        console.log(`   This video is too large for MongoDB Atlas.`);
        console.log(`   Skipping ${movie.title}\n`);
        continue;
      }

      movie.videoData = videoBuffer;
      movie.videoContentType = 'video/mp4';
      movie.videoUrl = `http://localhost:5001/api/video/stream/${movie._id}`;
      
      await movie.save();
      console.log(`   ✅ Uploaded successfully!\n`);
    }

    console.log('Upload complete!');
    console.log('\nTo verify, run: node checkVideos.js');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

uploadVideos();
