const express = require('express');
const {
  syncStudents,
  syncAttendance,
  syncNotifications,
  getSyncStatus,
  cleanupSyncData
} = require('../controllers/sync.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/students', authorize('admin', 'admission'), syncStudents);
router.post('/attendance', authorize('admin', 'teacher'), syncAttendance);
router.post('/notifications', authorize('admin', 'teacher'), syncNotifications);
router.get('/status', getSyncStatus);
router.delete('/cleanup', authorize('admin'), cleanupSyncData);

module.exports = router;