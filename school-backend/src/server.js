const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const { connectDB } = require('./config/db');
const { requestLogger, errorLogger, securityLogger, syncLogger } = require('./middleware/logging');

// Load environment variables
console.log('DATABASE_URL after dotenv:', process.env.DATABASE_URL);
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API-specific rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 API requests per windowMs
  message: {
    success: false,
    error: 'API rate limit exceeded, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  },
});

// Middleware
app.use(compression()); // Enable gzip compression
app.use(limiter);
app.use('/api', apiLimiter); // API rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/oauth', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(requestLogger);
app.use(securityLogger);
app.use(syncLogger);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/oauth', require('./routes/oauth.routes').router);
// User management routes (admin only)
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/students', require('./routes/student.routes'));
// app.use('/api/teachers', require('./routes/teacher.routes'));
// app.use('/api/parents', require('./routes/parent.routes'));
// app.use('/api/classes', require('./routes/class.routes'));
// app.use('/api/subjects', require('./routes/subject.routes'));
// app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/support', require('./routes/support.routes'));
app.use('/api/sync', require('./routes/sync.routes'));
app.use('/api/privacy', require('./routes/privacy.routes'));
// app.use('/api/results', require('./routes/result.routes'));

// Payment routes (admin and finance access)
app.use('/api/payments', require('./routes/payment.routes'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to School Management System API' });
});

// Error logging middleware
app.use(errorLogger);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message);
    error = { message, statusCode: 400 };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // OAuth2 errors
  if (err.name === 'OAuth2Error') {
    error = { message: err.message, statusCode: err.status || 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;