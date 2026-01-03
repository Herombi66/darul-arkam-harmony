const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { authenticate, isActive } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate, isActive);

// Assignment routes
router.get('/', assignmentController.getAssignments);
router.get('/:assignmentId', assignmentController.getAssignmentDetails);
router.post('/:assignmentId/submit', assignmentController.submitAssignment);

module.exports = router;