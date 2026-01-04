const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');

// @desc    Get all support tickets
// @route   GET /api/support/tickets
// @access  Private/Admin
const getTickets = asyncHandler(async (req, res) => {
  const tickets = await pool.query('SELECT * FROM support_tickets ORDER BY created_at DESC');
  res.json(tickets.rows);
});

// @desc    Create a support ticket
// @route   POST /api/support/tickets
// @access  Private/Admin
const createTicket = asyncHandler(async (req, res) => {
  const { title, description, category, priority, requesterId } = req.body;
  const newTicket = await pool.query(
    'INSERT INTO support_tickets (title, description, category, priority, requester_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, category, priority, requesterId]
  );
  res.status(201).json(newTicket.rows[0]);
});

// @desc    Update a support ticket
// @route   PUT /api/support/tickets/:id
// @access  Private/Admin
const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;
  const updatedTicket = await pool.query(
    'UPDATE support_tickets SET status = $1, assigned_to = $2 WHERE id = $3 RETURNING *',
    [status, assignedTo, id]
  );
  res.json(updatedTicket.rows[0]);
});

// @desc    Delete a support ticket
// @route   DELETE /api/support/tickets/:id
// @access  Private/Admin
const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM support_tickets WHERE id = $1', [id]);
  res.json({ message: 'Ticket removed' });
});

// @desc    Add a response to a ticket
// @route   POST /api/support/tickets/:id/responses
// @access  Private/Admin
const addTicketResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, isInternal } = req.body;
  const authorId = req.user.id;
  const newResponse = await pool.query(
    'INSERT INTO ticket_responses (ticket_id, author_id, content, is_internal) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, authorId, content, isInternal]
  );
  res.status(201).json(newResponse.rows[0]);
});

// @desc    Get all FAQs
// @route   GET /api/support/faqs
// @access  Private/Admin
const getFaqs = asyncHandler(async (req, res) => {
  const faqs = await pool.query('SELECT * FROM faqs ORDER BY category');
  res.json(faqs.rows);
});

// @desc    Create a FAQ
// @route   POST /api/support/faqs
// @access  Private/Admin
const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;
  const newFaq = await pool.query(
    'INSERT INTO faqs (question, answer, category) VALUES ($1, $2, $3) RETURNING *',
    [question, answer, category]
  );
  res.status(201).json(newFaq.rows[0]);
});

// @desc    Update a FAQ
// @route   PUT /api/support/faqs/:id
// @access  Private/Admin
const updateFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { question, answer, category } = req.body;
  const updatedFaq = await pool.query(
    'UPDATE faqs SET question = $1, answer = $2, category = $3 WHERE id = $4 RETURNING *',
    [question, answer, category, id]
  );
  res.json(updatedFaq.rows[0]);
});

// @desc    Delete a FAQ
// @route   DELETE /api/support/faqs/:id
// @access  Private/Admin
const deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM faqs WHERE id = $1', [id]);
  res.json({ message: 'FAQ removed' });
});

module.exports = {
  getTickets,
  getFaqs,
  createTicket,
  createFaq,
  updateTicket,
  updateFaq,
  deleteTicket,
  deleteFaq,
  addTicketResponse,
};