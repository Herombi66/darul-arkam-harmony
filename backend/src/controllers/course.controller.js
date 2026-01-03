const Course = require('../models/course.model');
const Student = require('../models/student.model');

// Get available courses for enrollment
exports.getAvailableCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    
    // Find courses for student's grade that they're not already enrolled in
    const availableCourses = await Course.find({
      grade: student.grade,
      isActive: true,
      _id: { $nin: student.enrolledCourses }
    }).populate('teacher', 'name email');
    
    res.status(200).json({ success: true, data: availableCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    if (!course.isActive) {
      return res.status(400).json({ success: false, message: 'Course is not active for enrollment' });
    }
    
    const student = await Student.findById(req.user._id);
    
    // Check if student is already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }
    
    // Add course to student's enrolled courses
    student.enrolledCourses.push(courseId);
    await student.save();
    
    // Add student to course's students
    course.students.push(student._id);
    await course.save();
    
    res.status(200).json({ success: true, message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get course details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId)
      .populate('teacher', 'name email')
      .populate('students', 'name email studentId');
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};