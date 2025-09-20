const Student = require('../models/Student');
const User = require('../models/User');
const sequelize = require('../config/sequelize');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Teacher
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin/Teacher/Parent
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'profileImage']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin/Admission
exports.createStudent = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      phoneNumber
    } = req.body;

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'student',
      phoneNumber,
      address
    }, { transaction });

    // Create student profile
    const student = await Student.create({
      userId: user.id,
      dateOfBirth,
      gender,
      bloodGroup
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin/Admission
exports.updateStudent = async (req, res) => {
  try {
    const [updatedRowsCount, updatedRows] = await Student.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

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

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Delete user account as well
    await User.destroy({ where: { id: student.userId }, transaction });
    await Student.destroy({ where: { id: req.params.id }, transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student subjects
// @route   GET /api/students/:id/subjects
// @access  Private/Student/Teacher/Parent/Admin
exports.getStudentSubjects = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // For now, return empty array until subject enrollment is implemented
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student results
// @route   GET /api/students/:id/results
// @access  Private/Student/Teacher/Parent/Admin
exports.getStudentResults = async (req, res) => {
  try {
    // For now, return empty array until Result model is implemented
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student attendance
// @route   GET /api/students/:id/attendance
// @access  Private/Student/Teacher/Parent/Admin
exports.getStudentAttendance = async (req, res) => {
  try {
    const Attendance = require('../models/Attendance');
    const attendance = await Attendance.findAll({
      where: { studentId: req.params.id },
      include: [
        {
          model: User,
          as: 'markedBy',
          attributes: ['firstName', 'lastName']
        }
      ]
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

// @desc    Get student payments
// @route   GET /api/students/:id/payments
// @access  Private/Student/Parent/Admin/Finance
exports.getStudentPayments = async (req, res) => {
  try {
    // For now, return empty array until Payment model is implemented
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};