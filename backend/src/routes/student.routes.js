const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticate, isActive } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate, isActive);

// Student profile routes
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.get('/courses', studentController.getEnrolledCourses);
router.get('/attendance', studentController.getAttendance);

module.exports = router;