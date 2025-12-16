import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const checkVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const movies = await Movie.find({});
    
    console.log('\n=== VIDEO STORAGE CHECK ===');
    movies.forEach(movie => {
      const hasVideo = movie.videoData && movie.videoData.length > 0;
      const videoSize = hasVideo ? `${(movie.videoData.length / 1024 / 1024).toFixed(2)} MB` : 'No video';
      
      console.log(`${movie.title}: ${videoSize}`);
    });

    const totalWithVideos = movies.filter(m => m.videoData && m.videoData.length > 0).length;
    console.log(`\nTotal movies: ${movies.length}`);
    console.log(`Movies with videos: ${totalWithVideos}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkVideos();