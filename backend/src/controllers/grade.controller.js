const Grade = require('../models/grade.model');
const Student = require('../models/student.model');

// Get all grades for a student
exports.getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user._id })
      .populate('course', 'courseCode name description')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get grades for a specific course
exports.getCourseGrades = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const grades = await Grade.find({ 
      student: req.user._id,
      course: courseId
    }).populate('course', 'courseCode name description');
    
    if (!grades.length) {
      return res.status(404).json({ success: false, message: 'No grades found for this course' });
    }
    
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get grade analysis and statistics
exports.getGradeAnalysis = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    const grades = await Grade.find({ student: req.user._id })
      .populate('course', 'courseCode name');
    
    // Calculate GPA and other statistics
    let totalPoints = 0;
    let totalCredits = 0;
    let courseStats = [];
    
    grades.forEach(grade => {
      if (grade.finalGrade && grade.finalGrade.letter) {
        let points = 0;
        
        // Convert letter grade to points
        switch(grade.finalGrade.letter) {
          case 'A+': points = 4.0; break;
          case 'A': points = 4.0; break;
          case 'A-': points = 3.7; break;
          case 'B+': points = 3.3; break;
          case 'B': points = 3.0; break;
          case 'B-': points = 2.7; break;
          case 'C+': points = 2.3; break;
          case 'C': points = 2.0; break;
          case 'C-': points = 1.7; break;
          case 'D+': points = 1.3; break;
          case 'D': points = 1.0; break;
          case 'F': points = 0.0; break;
          default: points = 0.0;
        }
        
        // Assuming each course is 3 credits
        const credits = 3;
        totalPoints += points * credits;
        totalCredits += credits;
        
        courseStats.push({
          course: grade.course.courseCode,
          courseName: grade.course.name,
          grade: grade.finalGrade.letter,
          score: grade.finalGrade.score,
          points
        });
      }
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    
    // Count grades by letter
    const gradeCounts = {
      'A+': 0, 'A': 0, 'A-': 0,
      'B+': 0, 'B': 0, 'B-': 0,
      'C+': 0, 'C': 0, 'C-': 0,
      'D+': 0, 'D': 0, 'F': 0
    };
    
    grades.forEach(grade => {
      if (grade.finalGrade && grade.finalGrade.letter) {
        gradeCounts[grade.finalGrade.letter]++;
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        student: {
          name: student.name,
          studentId: student.studentId,
          grade: student.grade
        },
        gpa,
        totalCredits,
        courseStats,
        gradeCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};