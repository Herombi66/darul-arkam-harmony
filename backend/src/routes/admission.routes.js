const express = require('express');
const router = express.Router();
const { submitApplication, getAdmissionDashboard, acceptApplication, getApplications } = require('../controllers/admission.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', submitApplication);
router.get('/dashboard', protect, getAdmissionDashboard);
router.post('/applications/:id/accept', protect, acceptApplication);
router.get('/applications', protect, getApplications);

module.exports = router;