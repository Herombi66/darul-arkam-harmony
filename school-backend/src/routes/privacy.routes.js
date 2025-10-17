const express = require('express');
const {
  getConsentStatus,
  updateConsent,
  requestDataExport,
  requestDataDeletion,
  getRetentionPolicy,
  reportDataBreach,
  getPrivacyDashboard
} = require('../controllers/privacy.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All privacy routes require authentication
router.use(protect);

// Consent management
router.route('/consent')
  .get(getConsentStatus)
  .put(updateConsent);

// Data subject rights (GDPR)
router.get('/dashboard', getPrivacyDashboard);
router.post('/export', requestDataExport);
router.delete('/delete', requestDataDeletion);

// Public information
router.get('/retention', getRetentionPolicy);

// Admin only - data breach reporting
router.post('/breach', authorize('admin'), reportDataBreach);

module.exports = router;