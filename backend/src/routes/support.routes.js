const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const {
  getTickets,
  getFaqs,
  createTicket,
  createFaq,
  updateTicket,
  updateFaq,
  deleteTicket,
  deleteFaq,
  addTicketResponse,
} = require('../controllers/support.controller');

router.get('/tickets', [protect, admin], getTickets);
router.post('/tickets', [protect, admin], createTicket);
router.put('/tickets/:id', [protect, admin], updateTicket);
router.delete('/tickets/:id', [protect, admin], deleteTicket);
router.post('/tickets/:id/responses', [protect, admin], addTicketResponse);

router.get('/faqs', [protect, admin], getFaqs);
router.post('/faqs', [protect, admin], createFaq);
router.put('/faqs/:id', [protect, admin], updateFaq);
router.delete('/faqs/:id', [protect, admin], deleteFaq);

module.exports = router;