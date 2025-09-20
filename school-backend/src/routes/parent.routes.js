const express = require('express');
const {
  getParents,
  getParent,
  createParent,
  updateParent,
  deleteParent,
  getParentChildren
} = require('../controllers/parent.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getParents)
  .post(authorize('admin', 'admission'), createParent);

router.route('/:id')
  .get(authorize('admin', 'parent'), getParent)
  .put(authorize('admin'), updateParent)
  .delete(authorize('admin'), deleteParent);

router.route('/:id/children')
  .get(authorize('admin', 'parent'), getParentChildren);

module.exports = router;