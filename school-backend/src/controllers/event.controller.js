const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { type, status, startDate, endDate } = req.query;

    let whereClause = {};

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.date = {
        [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { count, rows: events } = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'attendees',
          attributes: ['firstName', 'lastName', 'email'],
          through: { attributes: [] }
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin/Teacher
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      type,
      maxAttendees,
      priority
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      type,
      organizerId: req.user.id,
      maxAttendees,
      priority
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Teacher
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if user is the organizer or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await event.update(req.body);

    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin/Teacher
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if user is the organizer or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'attendees',
        attributes: ['id'],
        through: { attributes: [] }
      }]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        error: 'Cannot register for this event'
      });
    }

    // Check if user is already registered
    const isRegistered = event.attendees.some(attendee => attendee.id === req.user.id);
    if (isRegistered) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this event'
      });
    }

    // Check capacity
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        error: 'Event is at full capacity'
      });
    }

    await event.addAttendee(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    await event.removeAttendee(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Private/Admin/Teacher
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'attendees',
        attributes: ['firstName', 'lastName', 'email', 'role'],
        through: { attributes: [] }
      }]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      count: event.attendees.length,
      data: event.attendees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};