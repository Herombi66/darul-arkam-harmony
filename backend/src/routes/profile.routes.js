const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/file-upload');
const {
  getProfile,
  updateProfile,
  changePassword,
  getActivityLogs,
  updateAvatar,
} = require('../controllers/profile.controller');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/avatar', protect, upload, updateAvatar);
router.put('/password', protect, changePassword);
router.get('/activity', protect, getActivityLogs);

module.exports = router;