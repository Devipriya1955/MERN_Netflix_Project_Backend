import express from 'express';
import { 
  addToMyList, 
  removeFromMyList, 
  getMyList,
  getContinueWatching,
  saveWatchProgress,
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  getDownloads,
  addDownload,
  removeDownload
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/list/add', protect, addToMyList);
router.post('/list/remove', protect, removeFromMyList);
router.get('/list', protect, getMyList);

// Continue watching routes
router.get('/continue-watching', protect, getContinueWatching);
router.post('/watch-progress', protect, saveWatchProgress);

// Rating route
router.post('/rating', protect, (req, res) => {
  res.json({ message: 'Rating saved' });
});

// Profile routes
router.get('/profiles', protect, getProfiles);
router.post('/profiles', protect, createProfile);
router.put('/profiles/:id', protect, updateProfile);
router.delete('/profiles/:id', protect, deleteProfile);

// Download routes
router.get('/downloads', protect, getDownloads);
router.post('/downloads', protect, addDownload);
router.delete('/downloads/:id', protect, removeDownload);

export default router;