const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');

// @desc    Get financial summary
// @route   GET /api/finance/summary
// @access  Private/Admin
const getFinancialSummary = asyncHandler(async (req, res) => {
  const summary = await pool.query(
    'SELECT (SELECT SUM(amount) FROM payments WHERE status = \'completed\') AS totalRevenue, (SELECT SUM(amount) FROM expenses) AS totalExpenses, (SELECT SUM(amount) FROM payments WHERE status = \'completed\') - (SELECT SUM(amount) FROM expenses) AS netIncome, (SELECT SUM(amount) FROM payments WHERE status = \'pending\') AS outstandingPayments'
  );
  res.json(summary.rows[0]);
});

// @desc    Get all payments
// @route   GET /api/finance/payments
// @access  Private/Admin
const getPayments = asyncHandler(async (req, res) => {
  const payments = await pool.query(
    'SELECT p.id, s.full_name AS "studentName", s.id AS "studentId", p.amount, p.type AS "paymentType", p.method AS "paymentMethod", p.status, p.created_at AS date FROM payments p JOIN students s ON p.student_id = s.id ORDER BY p.created_at DESC'
  );
  res.json(payments.rows);
});

module.exports = {
  getFinancialSummary,
  getPayments,
};