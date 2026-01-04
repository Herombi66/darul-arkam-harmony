const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const {
  getMessages,
  getNotifications,
  sendMessage,
  sendNotification,
} = require('../controllers/messages.controller');

router.get('/', [protect, admin], getMessages);
router.get('/notifications', [protect, admin], getNotifications);
router.post('/', [protect, admin], sendMessage);
router.post('/notifications', [protect, admin], sendNotification);

module.exports = router;