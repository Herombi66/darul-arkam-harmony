const { prisma } = require('../prisma')

function todayBounds() {
  const start = new Date()
  start.setHours(0,0,0,0)
  const end = new Date()
  end.setHours(23,59,59,999)
  return { start, end }
}

function getDev() {
  try { if (!global.__teacherDev) {
    global.__teacherDev = {
      subjectsByTeacher: new Map(),
      classesByTeacher: new Map(),
      studentsByClass: new Map(),
      assignmentsByTeacher: new Map(),
      scheduleByTeacher: new Map(),
    }
    // seed minimal dev data
    const tId1 = 'tch-1'
    global.__teacherDev.subjectsByTeacher.set(tId1, [
      { subject: 'Mathematics', classes: ['SS2 A','SS1 C'] },
      { subject: 'Physics', classes: ['SS3 B','SS2 A'] },
    ])
    global.__teacherDev.classesByTeacher.set(tId1, [
      { class: 'SS2 A', level: 'SS2', students: 22 },
      { class: 'SS3 B', level: 'SS3', students: 18 },
      { class: 'SS1 C', level: 'SS1', students: 20 },
    ])
    global.__teacherDev.studentsByClass.set('SS2 A', Array.from({ length: 22 }, (_, i) => ({ id: `stu-ss2a-${i+1}`, name: `Student ${i+1}` })))
    global.__teacherDev.studentsByClass.set('SS3 B', Array.from({ length: 18 }, (_, i) => ({ id: `stu-ss3b-${i+1}`, name: `Student ${i+1}` })))
    global.__teacherDev.studentsByClass.set('SS1 C', Array.from({ length: 20 }, (_, i) => ({ id: `stu-ss1c-${i+1}`, name: `Student ${i+1}` })))
    global.__teacherDev.assignmentsByTeacher.set(tId1, [
      { id: 'asg-101', subject: 'Mathematics', class: 'SS2 A', graded: false },
      { id: 'asg-102', subject: 'Physics', class: 'SS3 B', graded: false },
      { id: 'asg-103', subject: 'Mathematics', class: 'SS1 C', graded: true },
    ])
    const now = new Date()
    const fmt = (d) => new Date(d).toISOString()
    global.__teacherDev.scheduleByTeacher.set(tId1, [
      { subject: 'Mathematics', class: 'SS2 A', start: fmt(now.setHours(8,0,0,0)), end: fmt(now.setHours(9,0,0,0)) },
      { subject: 'Physics', class: 'SS3 B', start: fmt(now.setHours(10,0,0,0)), end: fmt(now.setHours(11,0,0,0)) },
      { subject: 'Mathematics', class: 'SS1 C', start: fmt(now.setHours(13,0,0,0)), end: fmt(now.setHours(14,0,0,0)) },
      { subject: 'Physics', class: 'SS2 A', start: fmt(now.setHours(15,0,0,0)), end: fmt(now.setHours(16,0,0,0)) },
    ])
  } } catch {}
  return global.__teacherDev
}

exports.getOverview = async (req, res) => {
  try {
    const teacherId = req.params.id || req.user.id
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev()
      const subjects = dev.subjectsByTeacher.get(teacherId) || []
      const classes = dev.classesByTeacher.get(teacherId) || []
      const assignments = dev.assignmentsByTeacher.get(teacherId) || []
      const schedule = dev.scheduleByTeacher.get(teacherId) || []
      const pendingAssignments = assignments.filter(a => !a.graded).length
      const todayClasses = schedule.length
      const totalStudents = classes.reduce((acc, c) => acc + (c.students || 0), 0)
      return res.status(200).json({ success: true, data: {
        subjectsTeaching: subjects.length,
        totalStudents,
        pendingAssignments,
        todayClasses,
      } })
    }
    // Production path (Prisma raw SQL stub; replace with real schema queries)
    return res.status(501).json({ success: false, message: 'Overview not implemented for production yet' })
  } catch (error) { res.status(500).json({ success: false, message: 'Server error', error: error.message }) }
}

exports.getSubjects = async (req, res) => {
  try {
    const teacherId = req.params.id || req.user.id
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev()
      const subjects = dev.subjectsByTeacher.get(teacherId) || []
      return res.status(200).json({ success: true, data: subjects })
    }
    return res.status(501).json({ success: false, message: 'Subjects not implemented for production yet' })
  } catch (error) { res.status(500).json({ success: false, message: 'Server error', error: error.message }) }
}

exports.getTodaySchedule = async (req, res) => {
  try {
    const teacherId = req.params.id || req.user.id
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev()
      const schedule = dev.scheduleByTeacher.get(teacherId) || []
      return res.status(200).json({ success: true, data: schedule })
    }
    return res.status(501).json({ success: false, message: 'Schedule not implemented for production yet' })
  } catch (error) { res.status(500).json({ success: false, message: 'Server error', error: error.message }) }
}

exports.getClassesStudents = async (req, res) => {
  try {
    const teacherId = req.params.id || req.user.id
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev()
      const subjects = dev.subjectsByTeacher.get(teacherId) || []
      const classes = subjects.flatMap(s => s.classes)
      const students = classes.flatMap(cls => dev.studentsByClass.get(cls) || [])
      return res.status(200).json({ success: true, data: students })
    }
    return res.status(501).json({ success: false, message: 'Classes/students not implemented for production yet' })
  } catch (error) { res.status(500).json({ success: false, message: 'Server error', error: error.message }) }
}

