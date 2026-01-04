const { pool } = require('../config/db');

const getSubjects = async (req, res) => {
  try {
    const subjects = await pool.query('SELECT * FROM courses');
    res.json(subjects.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await pool.query('SELECT * FROM student_courses');
    res.json(enrollments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGrades = async (req, res) => {
  try {
    const grades = await pool.query('SELECT * FROM grades');
    res.json(grades.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubject = async (req, res) => {
  const { name, code, teacher, class: className } = req.body;
  try {
    const newSubject = await pool.query(
      'INSERT INTO courses (name, code, teacher_id, class_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, teacher, className]
    );
    res.status(201).json(newSubject.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSubjects,
  getEnrollments,
  getGrades,
  createSubject,
};