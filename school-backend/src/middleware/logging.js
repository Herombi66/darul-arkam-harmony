const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'school-management-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production then log to the `console` with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.id : null
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user ? req.user.id : null
    });
  });

  next();
};

// Error logging middleware
const errorLogger = (error, req, res, next) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user ? req.user.id : null,
    body: req.body,
    params: req.params,
    query: req.query
  });

  next(error);
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  // Log authentication attempts
  if (req.url.includes('/auth/') || req.url.includes('/oauth/')) {
    logger.info('Authentication attempt', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.method === 'POST' ? { ...req.body, password: '[REDACTED]' } : req.body
    });
  }

  // Log API access
  if (req.url.startsWith('/api/')) {
    logger.info('API access', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user ? req.user.id : null,
      userRole: req.user ? req.user.role : null
    });
  }

  next();
};

// Data sync logging middleware
const syncLogger = (req, res, next) => {
  if (req.url.includes('/sync/')) {
    const originalJson = res.json;
    res.json = function(data) {
      logger.info('Data synchronization', {
        method: req.method,
        url: req.url,
        userId: req.user ? req.user.id : null,
        syncType: req.url.split('/').pop(),
        result: data
      });
      originalJson.call(this, data);
    };
  }

  next();
};

module.exports = {
  logger,
  requestLogger,
  errorLogger,
  securityLogger,
  syncLogger
};