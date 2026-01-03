const express = require('express');
const router = express.Router();
const { authenticate, isActive } = require('../middleware/auth.middleware');
const presence = require('../controllers/presence.controller');

router.use(authenticate, isActive);

router.get('/active-users', presence.getActiveUsers);
router.post('/online', presence.setOnline);
router.post('/offline', presence.setOffline);

module.exports = router;

