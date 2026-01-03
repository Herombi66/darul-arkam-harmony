const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Login route (supports role + identifier + password)
router.post('/login', authController.login);

// Get current user profile (reads from JWT payload)
router.get('/profile', authenticate, authController.getProfile);

// Change password (501 during migration)
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;