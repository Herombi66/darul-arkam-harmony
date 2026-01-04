const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
  const messages = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  res.json(messages.rows);
});

// @desc    Get all notifications
// @route   GET /api/messages/notifications
// @access  Private/Admin
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
  res.json(notifications.rows);
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private/Admin
const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, subject, content, priority } = req.body;
  const senderId = req.user.id;

  const newMessage = await pool.query(
    'INSERT INTO messages (sender_id, recipient_id, subject, content, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [senderId, recipient, subject, content, priority]
  );

  res.status(201).json(newMessage.rows[0]);
});

// @desc    Send a notification
// @route   POST /api/messages/notifications
// @access  Private/Admin
const sendNotification = asyncHandler(async (req, res) => {
  const { title, message, type, priority, targetAudience } = req.body;

  const newNotification = await pool.query(
    'INSERT INTO notifications (title, message, type, priority, target_audience) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, message, type, priority, targetAudience]
  );

  res.status(201).json(newNotification.rows[0]);
});

const handleConnection = (socket) => {
  console.log('New client connected to messages controller:', socket.id);

  // Example: Join forums based on user role
  // You would typically get the user's role from the socket handshake or a separate authentication event
  const userRole = socket.handshake.query.role;

  if (userRole === 'teacher') {
    socket.join('teachers_forum');
    console.log(`Teacher ${socket.id} joined teachers_forum`);
  } else if (userRole === 'parent') {
    socket.join('parents_forum');
    console.log(`Parent ${socket.id} joined parents_forum`);
  }

  socket.on('join_forum', (forumName) => {
    socket.join(forumName);
    console.log(`Client ${socket.id} joined forum: ${forumName}`);
  });

  socket.on('leave_forum', (forumName) => {
    socket.leave(forumName);
    console.log(`Client ${socket.id} left forum: ${forumName}`);
  });

  socket.on('send_forum_message', ({ forumName, message }) => {
    socket.to(forumName).emit('forum_message', {
      ...message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from messages controller:', socket.id);
  });
};

module.exports = {
  getMessages,
  getNotifications,
  sendMessage,
  sendNotification,
  handleConnection,
};