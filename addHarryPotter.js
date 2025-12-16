import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const addHarryPotter = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const harryPotter = new Movie({
      title: "Harry Potter and the Sorcerer's Stone",
      description: "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
      poster: "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/hziiv14OpD73u9gAak4XDDfBKa2.jpg",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      category: "action",
      genre: ["Fantasy", "Adventure", "Family"],
      rating: 7.6,
      year: 2001,
      duration: "152m",
      cast: ["Daniel Radcliffe", "Emma Watson", "Rupert Grint"]
    });

    await harryPotter.save();
    console.log(`Harry Potter movie created with ID: ${harryPotter._id}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

addHarryPotter();