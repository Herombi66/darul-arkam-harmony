const express = require('express')
const router = express.Router()
const { authenticate, isActive } = require('../middleware/auth.middleware')
const teacher = require('../controllers/teacher.controller')

router.use(authenticate, isActive)

router.get('/:id/overview', teacher.getOverview)
router.get('/:id/subjects', teacher.getSubjects)
router.get('/:id/schedule/today', teacher.getTodaySchedule)
router.get('/:id/classes/students', teacher.getClassesStudents)

module.exports = router

