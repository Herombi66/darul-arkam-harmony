const jwt = require('jsonwebtoken');

// Middleware to verify JWT token (no DB lookup; trusts payload)
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload as user
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

// Middleware to check if user is active
const isActive = (req, res, next) => {
  if (!req.user || req.user.isActive === false) {
    return res.status(403).json({ message: 'Account is inactive' });
  }
  next();
};

module.exports = {
  authenticate,
  isActive
};