import Movie from '../models/Movie.js';

// Helper function to add fallback images
const addFallbackImages = (movie) => {
  const fallbackPoster = `https://placehold.co/300x450/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`;
  const fallbackBackdrop = `https://placehold.co/1280x720/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`;
  
  return {
    ...movie.toObject(),
    poster: movie.poster || fallbackPoster,
    backdrop: movie.backdrop || fallbackBackdrop,
    genre: movie.genre || ['Drama'],
    cast: movie.cast || ['Unknown'],
    rating: movie.rating || 7.0
  };
};

export const getAllMovies = async (req, res) => {
  try {
    const { q } = req.query; // Search query
    let query = {};
    
    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { genre: { $in: [new RegExp(q, 'i')] } },
          { cast: { $in: [new RegExp(q, 'i')] } }
        ]
      };
    }
    
    const movies = await Movie.find(query).maxTimeMS(30000).lean();
    const moviesWithFallbacks = movies.map(movie => ({
      ...movie,
      poster: movie.poster || `https://placehold.co/300x450/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`,
      backdrop: movie.backdrop || `https://placehold.co/1280x720/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`,
      genre: movie.genre || ['Drama'],
      cast: movie.cast || ['Unknown'],
      rating: movie.rating || 7.0
    }));
    
    res.json(moviesWithFallbacks);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};

export const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const movies = await Movie.find({ category }).maxTimeMS(30000).lean();
    
    const moviesWithFallbacks = movies.map(movie => ({
      ...movie,
      poster: movie.poster || `https://placehold.co/300x450/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`,
      backdrop: movie.backdrop || `https://placehold.co/1280x720/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`,
      genre: movie.genre || ['Drama'],
      cast: movie.cast || ['Unknown'],
      rating: movie.rating || 7.0
    }));
    
    res.json(moviesWithFallbacks);
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    res.status(500).json({ message: 'Failed to fetch movies by category', error: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).maxTimeMS(30000).lean();
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const movieWithFallbacks = {
      ...movie,
      poster: movie.poster || `https://placehold.co/300x450/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`,
      backdrop: movie.backdrop || `https://placehold.co/1280x720/333333/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`,
      genre: movie.genre || ['Drama'],
      cast: movie.cast || ['Unknown'],
      rating: movie.rating || 7.0
    };
    
    res.json(movieWithFallbacks);
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    res.status(500).json({ message: 'Failed to fetch movie', error: error.message });
  }
};
