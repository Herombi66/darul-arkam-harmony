const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventAttendees
} = require('../controllers/event.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes for all authenticated users
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', unregisterFromEvent);

// Admin and teacher only routes
router.use(authorize('admin', 'teacher'));
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/attendees', getEventAttendees);

module.exports = router;