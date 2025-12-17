import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'http://localhost:5173',
    'https://netflixbucket2025.s3.ap-southeast-2.amazonaws.com',
    'https://netflixbucket2025.s3-website-ap-southeast-2.amazonaws.com'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Netflix Clone API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});