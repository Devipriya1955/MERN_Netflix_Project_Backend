import User from '../models/User.js';

export const addToMyList = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.myList.includes(movieId)) {
      user.myList.push(movieId);
      await user.save();
    }
    
    res.json({ message: 'Movie added to list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromMyList = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);
    
    user.myList = user.myList.filter(id => id.toString() !== movieId);
    await user.save();
    
    res.json({ message: 'Movie removed from list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'myList',
      model: 'Movie'
    });
    res.json(user.myList || []);
  } catch (error) {
    console.error('Error getting my list:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getContinueWatching = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'continueWatching.movie',
      model: 'Movie'
    });
    res.json(user.continueWatching || []);
  } catch (error) {
    console.error('Error getting continue watching:', error);
    res.status(500).json({ message: error.message });
  }
};

export const saveWatchProgress = async (req, res) => {
  try {
    const { movieId, currentTime, duration } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { continueWatching: { movie: movieId } }
      },
      { new: true }
    );
    
    const progressData = {
      movie: movieId,
      currentTime,
      duration,
      lastWatched: new Date()
    };
    
    user.continueWatching.push(progressData);
    
    // Keep only last 10 items
    user.continueWatching = user.continueWatching
      .sort((a, b) => b.lastWatched - a.lastWatched)
      .slice(0, 10);
    
    await user.save();
    res.json({ message: 'Progress saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.profiles || []);
  } catch (error) {
    console.error('Error getting profiles:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { name, avatar, isKids } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.profiles.length >= 5) {
      return res.status(400).json({ message: 'Maximum 5 profiles allowed' });
    }
    
    const newProfile = {
      name,
      avatar,
      isKids: isKids || false
    };
    
    user.profiles.push(newProfile);
    await user.save();
    
    res.json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    const profileIndex = user.profiles.findIndex(p => p._id.toString() === id);
    if (profileIndex === -1) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    user.profiles[profileIndex] = { ...user.profiles[profileIndex].toObject(), ...updates };
    await user.save();
    
    res.json(user.profiles[profileIndex]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    if (user.profiles.length <= 1) {
      return res.status(400).json({ message: 'Cannot delete last profile' });
    }
    
    user.profiles = user.profiles.filter(p => p._id.toString() !== id);
    await user.save();
    
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getDownloads = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'downloads.movie',
      model: 'Movie'
    });
    res.json(user.downloads || []);
  } catch (error) {
    console.error('Error getting downloads:', error);
    res.status(500).json({ message: error.message });
  }
};

export const addDownload = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);
    
    const existingDownload = user.downloads.find(
      download => download.movie.toString() === movieId
    );
    
    if (existingDownload) {
      return res.status(400).json({ message: 'Movie already downloaded' });
    }
    
    user.downloads.push({
      movie: movieId,
      downloadedAt: new Date(),
      fileSize: Math.floor(Math.random() * 1000000000) + 500000000 // Random file size
    });
    
    await user.save();
    res.json({ message: 'Movie downloaded successfully' });
  } catch (error) {
    console.error('Error adding download:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    user.downloads = user.downloads.filter(download => download._id.toString() !== id);
    await user.save();
    
    res.json({ message: 'Download removed successfully' });
  } catch (error) {
    console.error('Error removing download:', error);
    res.status(500).json({ message: error.message });
  }
};