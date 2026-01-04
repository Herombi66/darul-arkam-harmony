const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const { getFinancialSummary, getPayments } = require('../controllers/finance.controller');

router.get('/summary', [protect, admin], getFinancialSummary);
router.get('/payments', [protect, admin], getPayments);

module.exports = router;