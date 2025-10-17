const SupportTicket = require('../models/SupportTicket');
const TicketResponse = require('../models/TicketResponse');
const User = require('../models/User');

// @desc    Get all support tickets
// @route   GET /api/support/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { status, category, priority, assignedTo } = req.query;

    let whereClause = {};

    // Filter based on user role
    if (req.user.role === 'student' || req.user.role === 'parent') {
      whereClause.requesterId = req.user.id;
    } else if (req.user.role !== 'admin') {
      // Staff can see tickets assigned to them or all if admin
      whereClause = {
        [require('sequelize').Op.or]: [
          { assignedToId: req.user.id },
          { requesterId: req.user.id }
        ]
      };
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority;
    }

    if (assignedTo && assignedTo !== 'all') {
      whereClause.assignedToId = assignedTo;
    }

    const { count, rows: tickets } = await SupportTicket.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['firstName', 'lastName', 'email', 'role']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['firstName', 'lastName', 'email'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count: tickets.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single support ticket
// @route   GET /api/support/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['firstName', 'lastName', 'email', 'role']
        },
        {
          model: User,
          as: 'assignedTo',
          attributes: ['firstName', 'lastName', 'email'],
          required: false
        },
        {
          model: TicketResponse,
          as: 'responses',
          include: [{
            model: User,
            as: 'author',
            attributes: ['firstName', 'lastName', 'email', 'role']
          }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    // Check if user has access to this ticket
    if (req.user.role !== 'admin' &&
        ticket.requesterId !== req.user.id &&
        ticket.assignedToId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this ticket'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create support ticket
// @route   POST /api/support/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await SupportTicket.create({
      title,
      description,
      category,
      priority,
      requesterId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update support ticket
// @route   PUT /api/support/tickets/:id
// @access  Private/Admin/Staff
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this ticket'
      });
    }

    const updatedTicket = await ticket.update(req.body);

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete support ticket
// @route   DELETE /api/support/tickets/:id
// @access  Private/Admin
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    // Only admin can delete tickets
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this ticket'
      });
    }

    await ticket.destroy();

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

// @desc    Add response to ticket
// @route   POST /api/support/tickets/:id/responses
// @access  Private
exports.addResponse = async (req, res) => {
  try {
    const { content, isInternal } = req.body;

    const ticket = await SupportTicket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    // Check if user has access to this ticket
    if (req.user.role !== 'admin' &&
        ticket.requesterId !== req.user.id &&
        ticket.assignedToId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to respond to this ticket'
      });
    }

    const response = await TicketResponse.create({
      ticketId: req.params.id,
      content,
      authorId: req.user.id,
      isInternal: isInternal && (req.user.role === 'admin' || req.user.role === 'teacher')
    });

    // Update ticket timestamp
    await ticket.update({ updatedAt: new Date() });

    res.status(201).json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Assign ticket to staff
// @route   PUT /api/support/tickets/:id/assign
// @access  Private/Admin/Teacher
exports.assignTicket = async (req, res) => {
  try {
    const { assignedToId } = req.body;

    const ticket = await SupportTicket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to assign tickets'
      });
    }

    await ticket.update({
      assignedToId,
      status: assignedToId ? 'in_progress' : 'open',
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Ticket assigned successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get ticket statistics
// @route   GET /api/support/stats
// @access  Private/Admin/Teacher
exports.getStats = async (req, res) => {
  try {
    const stats = await SupportTicket.findAll({
      attributes: [
        'status',
        'category',
        'priority',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status', 'category', 'priority'],
      raw: true
    });

    const totalTickets = await SupportTicket.count();
    const openTickets = await SupportTicket.count({ where: { status: 'open' } });
    const resolvedToday = await SupportTicket.count({
      where: {
        status: 'resolved',
        updatedAt: {
          [require('sequelize').Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        resolvedToday,
        breakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};