const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private/Admin
const getProfile = asyncHandler(async (req, res) => {
  const profile = await pool.query('SELECT id, first_name, last_name, email, phone, address, date_of_birth, employee_id, role, department, join_date, bio, profile_image FROM users WHERE id = $1', [req.user.id]);
  if (profile.rows.length > 0) {
    res.json(profile.rows[0]);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private/Admin
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, address, bio } = req.body;
  const updatedProfile = await pool.query(
    'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5, bio = $6 WHERE id = $7 RETURNING id, first_name, last_name, email, phone, address, bio',
    [firstName, lastName, email, phone, address, bio, req.user.id]
  );
  res.json(updatedProfile.rows[0]);
});

// @desc    Update user avatar
// @route   POST /api/profile/avatar
// @access  Private
const updateAvatar = asyncHandler(async (req, res) => {
  if (req.file) {
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    const updatedProfile = await pool.query(
      'UPDATE users SET profile_image_url = $1 WHERE id = $2 RETURNING id, profile_image_url',
      [imageUrl, req.user.id]
    );
    res.json(updatedProfile.rows[0]);
  } else {
    res.status(400);
    throw new Error('Please upload a file');
  }
});

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private/Admin
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

  if (user.rows.length > 0 && (await bcrypt.compare(currentPassword, user.rows[0].password))) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401);
    throw new Error('Invalid current password');
  }
});

// @desc    Get activity logs
// @route   GET /api/profile/activity
// @access  Private/Admin
const getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await pool.query('SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(logs.rows);
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getActivityLogs,
  updateAvatar,
};