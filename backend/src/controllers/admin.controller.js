const { pool } = require('../config/db');

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalStudents = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['student']);
    const totalTeachers = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['teacher']);
    const totalSubjects = await pool.query('SELECT COUNT(*) FROM courses');

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count, 10),
      totalStudents: parseInt(totalStudents.rows[0].count, 10),
      totalTeachers: parseInt(totalTeachers.rows[0].count, 10),
      totalSubjects: parseInt(totalSubjects.rows[0].count, 10),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAdminDashboardStats };