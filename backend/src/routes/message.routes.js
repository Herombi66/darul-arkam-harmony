const express = require('express');
const router = express.Router();
const { authenticate, isActive } = require('../middleware/auth.middleware');
const messageController = require('../controllers/message.controller');

router.use(authenticate, isActive);

router.get('/threads', messageController.getThreads);
router.get('/threads/:threadId', messageController.getThread);
router.post('/threads', messageController.createThread);
router.get('/inbox', messageController.getInbox);
router.post('/send', messageController.sendMessage);
router.post('/:messageId/read', messageController.markRead);
router.get('/search', messageController.search);
router.post('/flag', messageController.flag);
router.delete('/flag', messageController.unflag);
router.post('/archive', messageController.archive);
router.delete('/archive', messageController.unarchive);
router.post('/attach', messageController.attach);

module.exports = router;