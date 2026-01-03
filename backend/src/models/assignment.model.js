const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  attachments: [{
    filename: String,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    files: [{
      filename: String,
      path: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: ['submitted', 'late', 'graded', 'returned'],
      default: 'submitted'
    },
    score: {
      type: Number
    },
    feedback: String,
    isLate: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for calculating submission status
assignmentSchema.virtual('submissionStats').get(function() {
  const totalStudents = this.course.students ? this.course.students.length : 0;
  const submitted = this.submissions.length;
  const graded = this.submissions.filter(sub => sub.status === 'graded' || sub.status === 'returned').length;
  
  return {
    totalStudents,
    submitted,
    pending: totalStudents - submitted,
    graded,
    pendingGrading: submitted - graded
  };
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;