import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from './models/Movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const movieMappings = [
  { title: 'Stranger Things', filename: 'Stranger_Things_Clip1.mp4' },
  { title: 'The Witcher', filename: 'The_Witcher_Clip5.mp4' },
  { title: 'Breaking Bad', filename: 'BreakingBad_Clip2.mp4' },
  { title: 'The Falcon and the Winter Soldier', filename: 'Winter_Soldier_Clip4.mp4' },
  { title: 'Harry Potter', filename: 'Harry_Potter_Clip3.mp4' }
];

const uploadVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    for (const mapping of movieMappings) {
      console.log(`Processing: ${mapping.title}`);
      
      const movie = await Movie.findOne({ title: mapping.title });
      
      if (!movie) {
        console.log(`   ❌ Movie not found in database\n`);
        continue;
      }

      const videoPath = path.join(__dirname, 'videos', mapping.filename);
      
      if (!fs.existsSync(videoPath)) {
        console.log(`   ❌ Video file not found: ${mapping.filename}\n`);
        continue;
      }

      const videoBuffer = fs.readFileSync(videoPath);
      const videoSizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);
      
      console.log(`   Size: ${videoSizeMB} MB`);
      
      if (videoBuffer.length > 16 * 1024 * 1024) {
        console.log(`   ⚠️  File exceeds MongoDB 16MB limit!\n`);
        continue;
      }

      movie.videoData = videoBuffer;
      movie.videoContentType = 'video/mp4';
      movie.videoUrl = `http://localhost:5001/api/video/stream/${movie._id}`;
      
      await movie.save();
      console.log(`   ✅ Uploaded successfully!\n`);
    }

    console.log('Upload complete!\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

uploadVideos();
