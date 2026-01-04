const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, first_name, last_name, email, role, status, last_login, created_at FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber, address } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, role, phone_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, email, role, status, created_at',
      [firstName, lastName, email, hashedPassword, role, phoneNumber, address]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role, status } = req.body;
  try {
    const updatedUser = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, role = $4, status = $5 WHERE id = $6 RETURNING id, first_name, last_name, email, role, status',
      [firstName, lastName, email, role, status, id]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};