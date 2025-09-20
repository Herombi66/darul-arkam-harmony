const Teacher = require('../models/Teacher');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user', 'firstName lastName email')
      .populate('subjects', 'name code')
      .populate('classes', 'name section');
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private/Admin/Teacher
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', 'firstName lastName email profileImage')
      .populate('subjects', 'name code')
      .populate('classes', 'name section');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    
    // Check if user is authorized to view this teacher
    if (req.user.role === 'teacher' && req.user.id !== teacher.user.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this teacher profile'
      });
    }
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create teacher
// @route   POST /api/teachers
// @access  Private/Admin
exports.createTeacher = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      qualification,
      subjects,
      classes,
      experience,
      salary,
      phoneNumber,
      address
    } = req.body;
    
    // Create user first
    const user = await User.create([{
      firstName,
      lastName,
      email,
      password,
      role: 'teacher',
      phoneNumber,
      address
    }], { session });
    
    // Create teacher profile
    const teacher = await Teacher.create([{
      user: user[0]._id,
      qualification,
      subjects,
      classes,
      experience,
      salary
    }], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: teacher[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
exports.deleteTeacher = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    
    // Delete user account as well
    await User.findByIdAndDelete(teacher.user, { session });
    await Teacher.findByIdAndDelete(req.params.id, { session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Assign subjects to teacher
// @route   PUT /api/teachers/:id/subjects
// @access  Private/Admin
exports.assignSubjects = async (req, res) => {
  try {
    const { subjects } = req.body;
    
    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide subjects array'
      });
    }
    
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: { subjects } },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Assign classes to teacher
// @route   PUT /api/teachers/:id/classes
// @access  Private/Admin
exports.assignClasses = async (req, res) => {
  try {
    const { classes } = req.body;
    
    if (!classes || !Array.isArray(classes)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide classes array'
      });
    }
    
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: { classes } },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};