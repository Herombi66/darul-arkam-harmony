const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getEnrollments,
  getGrades,
  createSubject,
} = require('../controllers/academics.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/subjects', protect, admin, getSubjects);
router.get('/enrollments', protect, admin, getEnrollments);
router.get('/grades', protect, admin, getGrades);
router.post('/subjects', protect, admin, createSubject);

module.exports = router;