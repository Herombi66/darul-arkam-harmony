const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// Helmet middleware for security headers
const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Rate limiter to prevent brute-force attacks
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// XSS Protection
const xssClean = xss();

// Sanitize data against NoSQL injection
const mongoSanitizeMiddleware = mongoSanitize();

module.exports = {
  helmetMiddleware,
  rateLimiter,
  xssClean,
  mongoSanitize: mongoSanitizeMiddleware,
};