const express = require('express');
const {
  getNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  sendBulkNotifications
} = require('../controllers/notification.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications)
  .post(authorize('admin', 'teacher'), createNotification);

router.route('/:id')
  .get(getNotification)
  .delete(deleteNotification);

router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.get('/unread-count', getUnreadCount);
router.post('/bulk', authorize('admin'), sendBulkNotifications);

module.exports = router;