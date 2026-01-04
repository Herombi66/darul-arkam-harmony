const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/stats', protect, admin, getAdminDashboardStats);

module.exports = router;