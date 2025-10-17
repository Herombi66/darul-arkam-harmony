const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin/Teacher
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: User,
          as: 'markedBy',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private/Admin/Teacher
exports.getAttendanceRecord = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: User,
          as: 'markedBy',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/Admin/Teacher
exports.createAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check if attendance already exists for this student on this date
    const existingAttendance = await Attendance.findOne({
      where: { studentId, date }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: 'Attendance already recorded for this student on this date'
      });
    }

    const attendance = await Attendance.create({
      studentId,
      markedById: req.user.id,
      date,
      status,
      remarks
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin/Teacher
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    const [updatedRowsCount, updatedRows] = await Attendance.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    res.status(200).json({
      success: true,
      data: updatedRows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    await Attendance.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get attendance by date range
// @route   GET /api/attendance/date/:startDate/:endDate
// @access  Private/Admin/Teacher
exports.getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const attendance = await Attendance.findAll({
      where: {
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: User,
          as: 'markedBy',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};