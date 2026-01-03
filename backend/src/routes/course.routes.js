const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authenticate, isActive } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate, isActive);

// Course routes
router.get('/available', courseController.getAvailableCourses);
router.post('/enroll', courseController.enrollCourse);
router.get('/:courseId', courseController.getCourseDetails);

module.exports = router;