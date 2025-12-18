import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const reorderMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Define the 5 priority movies
    const priorityMovies = [
      'Stranger Things',
      'The Witcher', 
      'Breaking Bad',
      'The Falcon and the Winter Soldier',
      'Harry Potter'
    ];

    console.log('Reordering movies to prioritize your 5 videos...\n');

    // Get all movies
    const allMovies = await Movie.find({});
    
    // Group by category
    const categories = ['trending', 'toprated', 'action', 'comedy', 'horror'];
    
    for (const category of categories) {
      const categoryMovies = allMovies.filter(m => m.category === category);
      
      // Separate priority and non-priority movies
      const priority = categoryMovies.filter(m => priorityMovies.includes(m.title));
      const others = categoryMovies.filter(m => !priorityMovies.includes(m.title));
      
      // Reorder: priority first, then others
      const reordered = [...priority, ...others];
      
      console.log(`${category}: ${priority.length} priority movies moved to front`);
      
      // Update order in database (using a timestamp or order field)
      for (let i = 0; i < reordered.length; i++) {
        await Movie.findByIdAndUpdate(reordered[i]._id, { 
          updatedAt: new Date(Date.now() + i) 
        });
      }
    }

    console.log('\n✅ Movies reordered successfully!');
    console.log('\nYour 5 movies are now at the front of their categories.');
    console.log('Reseed the database to apply changes: node seedDB.js');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

reorderMovies();
