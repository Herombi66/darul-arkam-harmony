const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Helper to detect identifier type based on role
function detectIdentifier(role, identifier) {
  const isEmail = typeof identifier === 'string' && identifier.includes('@');
  if (role === 'student') {
    return isEmail ? 'email' : 'roll_number';
  }
  if (role === 'teacher') {
    return isEmail ? 'email' : 'id_number';
  }
  // default for other roles
  return 'email';
}

// DEV fallback users (enabled when AUTH_DEV_MODE === 'true')
const devUsers = [
  { id: 'stu-1', role: 'student', name: 'Test Student', email: 'student@example.com', roll_number: 'STU123', password: 'password123', is_active: true },
  { id: 'tch-1', role: 'teacher', name: 'Test Teacher', email: 'teacher@example.com', id_number: 'TCH123', password: 'password123', is_active: true },
  { id: 'adm-1', role: 'admin', name: 'Admin User', email: 'admin@example.com', password: 'password123', is_active: true },
];

// Add: auto-detect user and role when role is not provided
async function findUserAuto(identifierValue) {
  // DEV fallback
  if (process.env.AUTH_DEV_MODE === 'true') {
    const raw = typeof identifierValue === 'string' ? identifierValue : '';
    const input = raw.trim();
    const lower = input.toLowerCase();
    const byEmail = devUsers.find((u) => (u.email || '').toLowerCase() === lower);
    if (byEmail) return { user: byEmail, role: byEmail.role, identifierType: 'email' };
    const byRoll = devUsers.find((u) => (u.roll_number || '').trim() === input);
    if (byRoll) return { user: byRoll, role: byRoll.role, identifierType: 'roll_number' };
    const byId = devUsers.find((u) => (u.id_number || '').trim() === input);
    if (byId) return { user: byId, role: byId.role, identifierType: 'id_number' };
    return { user: null, role: null, identifierType: null };
  }

  // PostgreSQL lookups without known role
  try {
    const isEmail = typeof identifierValue === 'string' && identifierValue.includes('@');
    if (isEmail) {
      let rows = (await pool.query('SELECT id, name, email, roll_number, password_hash, is_active FROM students WHERE email = $1 LIMIT 1', [identifierValue])).rows;
      if (rows[0]) return { user: rows[0], role: 'student', identifierType: 'email' };
      rows = (await pool.query('SELECT id, name, email, id_number, password_hash, is_active FROM teachers WHERE email = $1 LIMIT 1', [identifierValue])).rows;
      if (rows[0]) return { user: rows[0], role: 'teacher', identifierType: 'email' };
      rows = (await pool.query('SELECT id, name, email, role, password_hash, is_active FROM users WHERE email = $1 LIMIT 1', [identifierValue])).rows;
      if (rows[0]) return { user: rows[0], role: rows[0].role, identifierType: 'email' };
    } else {
      let rows = (await pool.query('SELECT id, name, email, roll_number, password_hash, is_active FROM students WHERE roll_number = $1 LIMIT 1', [identifierValue])).rows;
      if (rows[0]) return { user: rows[0], role: 'student', identifierType: 'roll_number' };
      rows = (await pool.query('SELECT id, name, email, id_number, password_hash, is_active FROM teachers WHERE id_number = $1 LIMIT 1', [identifierValue])).rows;
      if (rows[0]) return { user: rows[0], role: 'teacher', identifierType: 'id_number' };
    }
    return { user: null, role: null, identifierType: null };
  } catch (err) {
    throw err;
  }
}

async function findUserByRoleAndIdentifier(role, identifierType, identifierValue) {
  // DEV fallback
  if (process.env.AUTH_DEV_MODE === 'true') {
    return devUsers.find((u) => {
      if (u.role !== role) return false;
      if (identifierType === 'email') return u.email === identifierValue;
      if (identifierType === 'roll_number') return u.roll_number === identifierValue;
      if (identifierType === 'id_number') return u.id_number === identifierValue;
      return false;
    }) || null;
  }

  // PostgreSQL lookups based on role and identifier type
  try {
    if (role === 'student') {
      if (identifierType === 'email') {
        const { rows } = await pool.query('SELECT id, name, email, roll_number, password_hash, is_active FROM students WHERE email = $1 LIMIT 1', [identifierValue]);
        return rows[0] || null;
      }
      if (identifierType === 'roll_number') {
        const { rows } = await pool.query('SELECT id, name, email, roll_number, password_hash, is_active FROM students WHERE roll_number = $1 LIMIT 1', [identifierValue]);
        return rows[0] || null;
      }
    } else if (role === 'teacher') {
      if (identifierType === 'email') {
        const { rows } = await pool.query('SELECT id, name, email, id_number, password_hash, is_active FROM teachers WHERE email = $1 LIMIT 1', [identifierValue]);
        return rows[0] || null;
      }
      if (identifierType === 'id_number') {
        const { rows } = await pool.query('SELECT id, name, email, id_number, password_hash, is_active FROM teachers WHERE id_number = $1 LIMIT 1', [identifierValue]);
        return rows[0] || null;
      }
    } else {
      // generic users table for other roles
      const { rows } = await pool.query('SELECT id, name, email, role, password_hash, is_active FROM users WHERE email = $1 AND role = $2 LIMIT 1', [identifierValue, role]);
      return rows[0] || null;
    }
  } catch (err) {
    // Bubble up error to be handled by caller
    throw err;
  }
}

// Login controller
exports.login = async (req, res) => {
  try {
    const { role: inputRole, identifier, password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    let role = inputRole;
    let user = null;
    let identifierType = null;

    if (role) {
      identifierType = detectIdentifier(role, identifier);
      user = await findUserByRoleAndIdentifier(role, identifierType, identifier);
    } else {
      const auto = await findUserAuto(identifier);
      user = auto.user;
      role = auto.role;
      identifierType = auto.identifierType;
    }

    if (!user || !role) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Active check
    const isActive = process.env.AUTH_DEV_MODE === 'true' ? user.is_active : !!user.is_active;
    if (!isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Verify password
    let passwordMatches = false;
    if (process.env.AUTH_DEV_MODE === 'true') {
      passwordMatches = user.password === password;
    } else {
      const hash = user.password_hash;
      if (!hash) {
        return res.status(500).json({ message: 'Server error: missing password hash' });
      }
      passwordMatches = await bcrypt.compare(password, hash);
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      role,
      name: user.name,
      email: user.email,
      isActive,
      ...(role === 'student' ? { roll_number: user.roll_number } : {}),
      ...(role === 'teacher' ? { id_number: user.id_number } : {}),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: payload,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile (lightweight, uses JWT payload)
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password (not implemented for PostgreSQL in this migration step)
exports.changePassword = async (req, res) => {
  try {
    return res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};