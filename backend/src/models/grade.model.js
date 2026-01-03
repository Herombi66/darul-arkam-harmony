const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  term: {
    type: String,
    enum: ['first', 'second', 'third', 'final'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  assessments: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['quiz', 'assignment', 'project', 'midterm', 'final', 'other'],
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    remarks: String
  }],
  finalGrade: {
    score: {
      type: Number
    },
    letter: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
    },
    remarks: String
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for calculating the current grade
gradeSchema.virtual('currentGrade').get(function() {
  if (!this.assessments.length) return null;
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  this.assessments.forEach(assessment => {
    const weightedScore = (assessment.score / assessment.maxScore) * assessment.weight;
    totalWeightedScore += weightedScore;
    totalWeight += assessment.weight;
  });
  
  return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : null;
});

// Method to calculate letter grade based on percentage
gradeSchema.methods.calculateLetterGrade = function(percentage) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;