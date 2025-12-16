import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const checkAllMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const movies = await Movie.find({});
    
    console.log('\n=== ALL MOVIES IN DATABASE ===');
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} - ID: ${movie._id}`);
    });

    console.log(`\nTotal movies: ${movies.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkAllMovies();