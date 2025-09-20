const express = require('express');
const {
  getPayments,
  getPayment,
  initializePayment,
  verifyPayment,
  getPaymentReceipt
} = require('../controllers/payment.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for payment verification callback
router.get('/verify', verifyPayment);

// Protected routes
router.use(protect);

router.route('/')
  .get(authorize('admin', 'finance'), getPayments);

router.route('/initialize')
  .post(authorize('admin', 'finance', 'parent'), initializePayment);

router.route('/:id')
  .get(authorize('admin', 'finance', 'parent'), getPayment);

router.route('/:id/receipt')
  .get(authorize('admin', 'finance', 'parent'), getPaymentReceipt);

module.exports = router;