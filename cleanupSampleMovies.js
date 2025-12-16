import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const cleanupSampleMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all sample movies
    const result = await Movie.deleteMany({ 
      title: { $regex: /^Sample Movie/ } 
    });

    console.log(`Deleted ${result.deletedCount} sample movies`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

cleanupSampleMovies();