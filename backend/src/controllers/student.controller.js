const Student = require('../models/student.model');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses', 'courseCode name description');
    
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'contactNumber', 'address', 'profileImage'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ success: false, message: 'Invalid updates' });
    }
    
    const student = await Student.findById(req.user._id);
    
    updates.forEach(update => student[update] = req.body[update]);
    await student.save();
    
    res.status(200).json({ success: true, data: student, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate({
        path: 'enrolledCourses',
        select: 'courseCode name description teacher schedule',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      });
    
    res.status(200).json({ success: true, data: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get student attendance
exports.getAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    
    // Filter attendance by date range if provided
    let filteredAttendance = student.attendance;
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      
      filteredAttendance = student.attendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }
    
    // Calculate attendance statistics
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(record => record.status === 'present').length;
    const absent = filteredAttendance.filter(record => record.status === 'absent').length;
    const late = filteredAttendance.filter(record => record.status === 'late').length;
    const excused = filteredAttendance.filter(record => record.status === 'excused').length;
    
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;
    
    res.status(200).json({
      success: true,
      data: {
        records: filteredAttendance,
        stats: {
          total,
          present,
          absent,
          late,
          excused,
          attendanceRate: attendanceRate.toFixed(2) + '%'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};