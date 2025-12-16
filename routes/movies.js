import express from 'express';
import { getAllMovies, getMoviesByCategory, getMovieById } from '../controllers/movieController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes for movies (no auth required)
router.get('/', getAllMovies);
router.get('/search', getAllMovies); // Search endpoint
router.get('/category/:category', getMoviesByCategory);
router.get('/:id', getMovieById);

export default router;