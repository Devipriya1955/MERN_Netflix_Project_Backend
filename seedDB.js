import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import { expandedMovies } from './data/expandedMovies.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert expanded movies
    await Movie.insertMany(expandedMovies);
    console.log(`${expandedMovies.length} movies inserted successfully`);

    // Show category breakdown
    const categories = {};
    expandedMovies.forEach(movie => {
      categories[movie.category] = (categories[movie.category] || 0) + 1;
    });
    
    console.log('\nMovies by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`${category}: ${count} movies`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();