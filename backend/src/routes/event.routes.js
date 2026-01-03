const express = require('express')
const router = express.Router()
const { authenticate, isActive } = require('../middleware/auth.middleware')
const eventController = require('../controllers/event.controller')

router.use(authenticate, isActive)

router.get('/upcoming', eventController.getUpcoming)
router.get('/', eventController.getAll)
router.get('/stats', eventController.getStats)
router.post('/', eventController.create)
router.put('/:id', eventController.update)
router.delete('/:id', eventController.remove)

module.exports = router
