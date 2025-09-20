const express = require('express');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignSubjects,
  assignClasses
} = require('../controllers/teacher.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher'), getTeachers)
  .post(authorize('admin'), createTeacher);

router.route('/:id')
  .get(authorize('admin', 'teacher'), getTeacher)
  .put(authorize('admin'), updateTeacher)
  .delete(authorize('admin'), deleteTeacher);

router.route('/:id/subjects')
  .put(authorize('admin'), assignSubjects);

router.route('/:id/classes')
  .put(authorize('admin'), assignClasses);

module.exports = router;