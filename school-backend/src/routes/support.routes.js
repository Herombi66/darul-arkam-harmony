const express = require('express');
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addResponse,
  assignTicket,
  getStats
} = require('../controllers/support.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes accessible to all authenticated users
router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicket);
router.post('/tickets', createTicket);
router.post('/tickets/:id/responses', addResponse);

// Admin and teacher only routes
router.use(authorize('admin', 'teacher'));
router.put('/tickets/:id', updateTicket);
router.delete('/tickets/:id', deleteTicket);
router.put('/tickets/:id/assign', assignTicket);
router.get('/stats', getStats);

module.exports = router;