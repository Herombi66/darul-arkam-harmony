const { v4: uuidv4 } = require('uuid');
const Assignment = require('../models/assignment.model');
const Student = require('../models/student.model');

// In-memory dev-mode data
const devAssignments = [
  {
    id: 'asg-1',
    title: 'Essay on Climate Change',
    description: 'Write a 1000-word essay discussing causes and effects of climate change.',
    course: { courseCode: 'ENG101', name: 'English Composition' },
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    maxScore: 100,
    attachments: [],
    isActive: true,
    submissions: {}, // keyed by studentId
  },
  {
    id: 'asg-2',
    title: 'Algebra Problem Set',
    description: 'Solve the attached algebra problems covering linear equations and inequalities.',
    course: { courseCode: 'MTH101', name: 'Basic Mathematics' },
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    maxScore: 50,
    attachments: [{ filename: 'algebra.pdf', path: '/files/algebra.pdf' }],
    isActive: true,
    submissions: {},
  },
  {
    id: 'asg-3',
    title: 'Physics Lab Report',
    description: 'Submit a detailed report of the pendulum experiment.',
    course: { courseCode: 'PHY101', name: 'Introduction to Physics' },
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    maxScore: 75,
    attachments: [],
    isActive: true,
    submissions: {},
  },
];

function toAssignmentListItem(asg, studentId) {
  const submission = asg.submissions[studentId];
  return {
    _id: asg.id,
    title: asg.title,
    description: asg.description,
    course: asg.course,
    dueDate: asg.dueDate,
    maxScore: asg.maxScore,
    attachments: asg.attachments,
    submissionStatus: submission ? submission.status : 'not_submitted',
    isLate: submission ? !!submission.isLate : false,
    score: submission ? submission.score ?? null : null,
    feedback: submission ? submission.feedback ?? null : null,
    submissionDate: submission ? submission.submissionDate ?? null : null,
  };
}

// Get assignments for student
exports.getAssignments = async (req, res) => {
  try {
    if (process.env.AUTH_DEV_MODE === 'true') {
      const studentId = req.user.id;
      // In dev mode, return all active assignments (optionally you could filter by course enrollment)
      const active = devAssignments.filter((a) => a.isActive);
      const payload = active.map((a) => toAssignmentListItem(a, studentId));
      return res.status(200).json({ success: true, data: payload });
    }

    // Production path (currently not implemented during migration)
    return res.status(501).json({ success: false, message: 'Assignments not implemented for production yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    if (process.env.AUTH_DEV_MODE === 'true') {
      const { assignmentId } = req.params;
      const { files } = req.body || {};

      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files submitted' });
      }

      const asg = devAssignments.find((a) => a.id === assignmentId);
      if (!asg) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      if (!asg.isActive) {
        return res.status(400).json({ success: false, message: 'Assignment is no longer active' });
      }

      const now = new Date();
      const isLate = now > new Date(asg.dueDate);
      const studentId = req.user.id;
      const existing = asg.submissions[studentId];
      const newSubmission = {
        id: uuidv4(),
        student: studentId,
        submissionDate: now.toISOString(),
        files,
        status: 'submitted',
        isLate,
        score: existing?.score ?? null,
        feedback: existing?.feedback ?? null,
      };
      asg.submissions[studentId] = newSubmission;

      return res.status(200).json({
        success: true,
        message: isLate ? 'Assignment submitted late' : 'Assignment submitted successfully',
      });
    }

    // Production path (currently not implemented during migration)
    return res.status(501).json({ success: false, message: 'Assignments not implemented for production yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get assignment details
exports.getAssignmentDetails = async (req, res) => {
  try {
    if (process.env.AUTH_DEV_MODE === 'true') {
      const { assignmentId } = req.params;
      const studentId = req.user.id;
      const asg = devAssignments.find((a) => a.id === assignmentId);
      if (!asg) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      const submission = asg.submissions[studentId] || null;
      return res.status(200).json({ success: true, data: { assignment: toAssignmentListItem(asg, studentId), submission } });
    }

    // Production path (currently not implemented during migration)
    return res.status(501).json({ success: false, message: 'Assignments not implemented for production yet' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};