const Parent = require('../models/Parent');
const User = require('../models/User');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// @desc    Get all parents
// @route   GET /api/parents
// @access  Private/Admin
exports.getParents = async (req, res) => {
  try {
    const parents = await Parent.find()
      .populate('user', 'firstName lastName email')
      .populate('children', 'rollNumber');
    
    res.status(200).json({
      success: true,
      count: parents.length,
      data: parents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single parent
// @route   GET /api/parents/:id
// @access  Private/Admin/Parent
exports.getParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id)
      .populate('user', 'firstName lastName email profileImage')
      .populate({
        path: 'children',
        select: 'rollNumber',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'Parent not found'
      });
    }
    
    // Check if user is authorized to view this parent
    if (req.user.role === 'parent' && req.user.id !== parent.user.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this parent profile'
      });
    }
    
    res.status(200).json({
      success: true,
      data: parent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create parent
// @route   POST /api/parents
// @access  Private/Admin/Admission
exports.createParent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      children,
      occupation,
      relationship,
      phoneNumber,
      address
    } = req.body;
    
    // Create user first
    const user = await User.create([{
      firstName,
      lastName,
      email,
      password,
      role: 'parent',
      phoneNumber,
      address
    }], { session });
    
    // Create parent profile
    const parent = await Parent.create([{
      user: user[0]._id,
      children,
      occupation,
      relationship
    }], { session });
    
    // Update students with parent reference
    if (children && children.length > 0) {
      await Student.updateMany(
        { _id: { $in: children } },
        { parent: parent[0]._id },
        { session }
      );
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      success: true,
      data: parent[0]
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

// @desc    Update parent
// @route   PUT /api/parents/:id
// @access  Private/Admin
exports.updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'Parent not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: parent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete parent
// @route   DELETE /api/parents/:id
// @access  Private/Admin
exports.deleteParent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const parent = await Parent.findById(req.params.id);
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'Parent not found'
      });
    }
    
    // Remove parent reference from students
    await Student.updateMany(
      { parent: parent._id },
      { $unset: { parent: "" } },
      { session }
    );
    
    // Delete user account as well
    await User.findByIdAndDelete(parent.user, { session });
    await Parent.findByIdAndDelete(req.params.id, { session });
    
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

// @desc    Get parent's children
// @route   GET /api/parents/:id/children
// @access  Private/Admin/Parent
exports.getParentChildren = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate({
      path: 'children',
      populate: [
        { path: 'user', select: 'firstName lastName email' },
        { path: 'class', select: 'name section' }
      ]
    });
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'Parent not found'
      });
    }
    
    // Check if user is authorized to view this parent's children
    if (req.user.role === 'parent' && req.user.id !== parent.user.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this information'
      });
    }
    
    res.status(200).json({
      success: true,
      count: parent.children.length,
      data: parent.children
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};