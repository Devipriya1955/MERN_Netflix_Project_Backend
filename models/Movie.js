import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  backdrop: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: false
  },
  videoData: {
    type: Buffer,
    required: false
  },
  videoContentType: {
    type: String,
    default: 'video/mp4'
  },
  category: {
    type: String,
    required: true,
    enum: ['trending', 'toprated', 'action', 'comedy', 'horror', 'romance', 'documentary']
  },
  genre: [String],
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  year: Number,
  duration: String,
  cast: [String]
}, {
  timestamps: true
});

export default mongoose.model('Movie', movieSchema);