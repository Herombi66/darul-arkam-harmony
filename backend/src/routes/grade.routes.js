const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/grade.controller');
const { authenticate, isActive } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate, isActive);

// Grade routes
router.get('/', gradeController.getStudentGrades);
router.get('/analysis', gradeController.getGradeAnalysis);
router.get('/course/:courseId', gradeController.getCourseGrades);

module.exports = router;