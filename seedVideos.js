import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const sampleVideosData = [
  {
    title: "Sample Movie 1",
    description: "A thrilling adventure movie with amazing action sequences.",
    poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    videoUrl: "http://localhost:5001/api/video/stream/", // Will be updated with ID
    category: "trending",
    genre: ["Action", "Adventure"],
    rating: 8.5,
    year: 2023,
    duration: "30s",
    cast: ["Actor 1", "Actor 2"]
  },
  {
    title: "Sample Movie 2", 
    description: "A romantic comedy that will make you laugh and cry.",
    poster: "https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/cqxg1CihGR5ge0i1wYXr4Rdeppu.jpg",
    videoUrl: "http://localhost:5001/api/video/stream/",
    category: "romance",
    genre: ["Romance", "Comedy"],
    rating: 7.8,
    year: 2023,
    duration: "30s", 
    cast: ["Actor 3", "Actor 4"]
  },
  {
    title: "Sample Movie 3",
    description: "A horror movie that will keep you on the edge of your seat.",
    poster: "https://image.tmdb.org/t/p/w500/38PkhBGRQtmVx2drvPik3F42qHO.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/zvKqJ7BfSNJ1N2VdHACKw8Qzqx5.jpg",
    videoUrl: "http://localhost:5001/api/video/stream/",
    category: "horror",
    genre: ["Horror", "Thriller"],
    rating: 8.2,
    year: 2023,
    duration: "30s",
    cast: ["Actor 5", "Actor 6"]
  },
  {
    title: "Sample Movie 4",
    description: "An action-packed thriller with non-stop excitement.",
    poster: "https://image.tmdb.org/t/p/w500/tM6xqRKXoloH9UchaJEyyRE9O1w.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/pnXeWzihG9BjrQybgKQ2XYEmKlk.jpg",
    videoUrl: "http://localhost:5001/api/video/stream/",
    category: "action",
    genre: ["Action", "Thriller"],
    rating: 8.7,
    year: 2023,
    duration: "30s",
    cast: ["Actor 7", "Actor 8"]
  },
  {
    title: "Sample Movie 5",
    description: "A hilarious comedy that will have you laughing out loud.",
    poster: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7L72gCz3Y5L9Zp7EWTV1CKBVNbr.jpg",
    videoUrl: "http://localhost:5001/api/video/stream/",
    category: "comedy",
    genre: ["Comedy"],
    rating: 8.0,
    year: 2023,
    duration: "30s",
    cast: ["Actor 9", "Actor 10"]
  }
];

const seedSampleMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert sample movies without video data
    const movies = await Movie.insertMany(sampleVideosData);
    console.log(`${movies.length} sample movies created for video upload`);
    
    console.log('\nMovie IDs for video upload:');
    movies.forEach(movie => {
      console.log(`${movie.title}: ${movie._id}`);
    });

    console.log('\nTo upload videos, use:');
    console.log('POST /api/video/upload/:movieId');
    console.log('Form data: video file (max 50MB)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
};

seedSampleMovies();