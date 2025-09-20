const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentSubjects,
  getStudentResults,
  getStudentAttendance,
  getStudentPayments
} = require('../controllers/student.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher', 'exam'), getStudents)
  .post(authorize('admin', 'admission'), createStudent);

router.route('/:id')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getStudent)
  .put(authorize('admin', 'admission'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.route('/:id/subjects')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getStudentSubjects);

router.route('/:id/results')
  .get(authorize('admin', 'teacher', 'student', 'parent', 'exam'), getStudentResults);

router.route('/:id/attendance')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getStudentAttendance);

router.route('/:id/payments')
  .get(authorize('admin', 'finance', 'student', 'parent'), getStudentPayments);

module.exports = router;