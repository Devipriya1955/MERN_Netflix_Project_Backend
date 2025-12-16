import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  myList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  continueWatching: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    currentTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    lastWatched: {
      type: Date,
      default: Date.now
    }
  }],
  profiles: [{
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    isKids: {
      type: Boolean,
      default: false
    },
    preferences: {
      language: {
        type: String,
        default: 'en'
      },
      maturityRating: {
        type: String,
        default: 'all'
      }
    }
  }],
  currentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'standard'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  },
  downloads: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    downloadedAt: {
      type: Date,
      default: Date.now
    },
    fileSize: {
      type: Number,
      default: 0
    },
    quality: {
      type: String,
      enum: ['standard', 'high', 'ultra'],
      default: 'standard'
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);