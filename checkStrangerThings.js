import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const checkStrangerThings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const strangerThings = await Movie.findOne({ title: "Stranger Things" });
    
    if (strangerThings) {
      console.log('Stranger Things found:');
      console.log('ID:', strangerThings._id);
      console.log('Title:', strangerThings.title);
      console.log('Has videoData:', !!strangerThings.videoData);
      console.log('Video size:', strangerThings.videoData ? `${(strangerThings.videoData.length / 1024 / 1024).toFixed(2)} MB` : 'No video');
      console.log('VideoContentType:', strangerThings.videoContentType);
    } else {
      console.log('Stranger Things not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkStrangerThings();