const express = require('express');
const {
  getAttendance,
  getAttendanceRecord,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceByDateRange
} = require('../controllers/attendance.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher'), getAttendance)
  .post(authorize('admin', 'teacher'), createAttendance);

router.route('/:id')
  .get(authorize('admin', 'teacher'), getAttendanceRecord)
  .put(authorize('admin', 'teacher'), updateAttendance)
  .delete(authorize('admin'), deleteAttendance);

router.route('/date/:startDate/:endDate')
  .get(authorize('admin', 'teacher'), getAttendanceByDateRange);

module.exports = router;