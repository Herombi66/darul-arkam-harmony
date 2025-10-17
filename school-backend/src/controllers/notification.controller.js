const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: { recipientId: req.user.id },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        recipientId: req.user.id
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin/Teacher
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipientId, expiresAt, metadata } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      recipientId,
      senderId: req.user.id,
      expiresAt,
      metadata
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        recipientId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.update({
      isRead: true,
      readAt: new Date()
    });

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      {
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          recipientId: req.user.id,
          isRead: false
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        recipientId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.destroy();

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

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        recipientId: req.user.id,
        isRead: false
      }
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Send bulk notifications
// @route   POST /api/notifications/bulk
// @access  Private/Admin
exports.sendBulkNotifications = async (req, res) => {
  try {
    const { title, message, type, priority, recipientIds, expiresAt, metadata } = req.body;

    const notifications = recipientIds.map(recipientId => ({
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      recipientId,
      senderId: req.user.id,
      expiresAt,
      metadata
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json({
      success: true,
      message: `Notifications sent to ${recipientIds.length} recipients`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};