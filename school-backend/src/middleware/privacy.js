const crypto = require('crypto');

// Data encryption/decryption utilities
const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

class DataEncryption {
  static encrypt(text) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedData, iv, authTag) {
    try {
      const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

// Privacy middleware functions
const privacyMiddleware = {
  // Data minimization middleware - removes unnecessary PII
  dataMinimization: (fieldsToRemove = []) => {
    return (req, res, next) => {
      if (req.body && typeof req.body === 'object') {
        fieldsToRemove.forEach(field => {
          if (req.body.hasOwnProperty(field)) {
            delete req.body[field];
          }
        });
      }
      next();
    };
  },

  // Purpose limitation middleware - checks if data use is for stated purpose
  purposeLimitation: (allowedPurposes = []) => {
    return (req, res, next) => {
      // In a real implementation, this would check against a consent management system
      const requestPurpose = req.headers['x-data-purpose'] || req.body?.purpose;

      if (!requestPurpose || !allowedPurposes.includes(requestPurpose)) {
        return res.status(403).json({
          success: false,
          error: 'Data access not permitted for this purpose',
          allowedPurposes: allowedPurposes
        });
      }

      next();
    };
  },

  // Data retention enforcement
  retentionEnforcement: (retentionPeriod = 2555) => { // Default 7 years in days
    return (req, res, next) => {
      // This would typically be used in cleanup jobs
      // For API requests, it could validate data access based on retention policies
      req.retentionPeriod = retentionPeriod;
      next();
    };
  },

  // Audit logging for privacy events
  privacyAudit: () => {
    return (req, res, next) => {
      const privacyEvent = {
        timestamp: new Date().toISOString(),
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method,
        dataCategories: this.identifyDataCategories(req),
        purpose: req.headers['x-data-purpose'] || 'unspecified'
      };

      // Log privacy event (in production, this would go to a secure audit system)
      console.log('PRIVACY AUDIT:', JSON.stringify(privacyEvent, null, 2));

      // Store in response for potential use
      res.locals.privacyEvent = privacyEvent;

      next();
    };
  },

  // Identify data categories in request
  identifyDataCategories: (req) => {
    const categories = [];
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return categories;
    }

    // Check for personal data
    if (body.firstName || body.lastName || body.email || body.phoneNumber) {
      categories.push('personal_identification');
    }

    // Check for sensitive data
    if (body.dateOfBirth || body.gender || body.bloodGroup) {
      categories.push('sensitive_personal');
    }

    // Check for educational data
    if (body.rollNumber || body.subjects || body.results) {
      categories.push('educational_records');
    }

    // Check for attendance data
    if (body.date || body.status || body.attendanceRecords) {
      categories.push('attendance_data');
    }

    return categories;
  },

  // Consent verification middleware
  consentVerification: (requiredConsents = ['data_processing']) => {
    return async (req, res, next) => {
      try {
        // In a real implementation, this would check a consent database
        const userConsents = {
          data_processing: true,
          marketing: false,
          third_party_sharing: false
        };

        const missingConsents = requiredConsents.filter(
          consent => !userConsents[consent]
        );

        if (missingConsents.length > 0) {
          return res.status(403).json({
            success: false,
            error: 'Required consents not provided',
            missingConsents: missingConsents,
            consentUrl: '/api/privacy/consent'
          });
        }

        req.userConsents = userConsents;
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Consent verification failed'
        });
      }
    };
  },

  // Data anonymization for logs
  anonymizeData: (fields = ['password', 'email', 'phoneNumber', 'address']) => {
    return (req, res, next) => {
      // Create a sanitized copy for logging
      const sanitizedBody = { ...req.body };

      fields.forEach(field => {
        if (sanitizedBody[field]) {
          if (field === 'email') {
            // Anonymize email: user@domain.com -> u***@d***.com
            const [user, domain] = sanitizedBody[field].split('@');
            sanitizedBody[field] = `${user.charAt(0)}${'*'.repeat(user.length - 1)}@${domain.charAt(0)}${'*'.repeat(domain.length - 1)}.${domain.split('.').pop()}`;
          } else {
            sanitizedBody[field] = '[REDACTED]';
          }
        }
      });

      req.sanitizedBody = sanitizedBody;
      next();
    };
  },

  // Rate limiting for privacy-sensitive operations
  privacyRateLimit: (windowMs = 15 * 60 * 1000, maxRequests = 10) => {
    const requests = new Map();

    return (req, res, next) => {
      const key = `${req.user?.id || req.ip}_${req.originalUrl}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean old entries
      for (const [k, timestamps] of requests.entries()) {
        requests.set(k, timestamps.filter(timestamp => timestamp > windowStart));
        if (requests.get(k).length === 0) {
          requests.delete(k);
        }
      }

      // Check current requests
      const userRequests = requests.get(key) || [];
      if (userRequests.length >= maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Too many privacy-sensitive requests. Please try again later.',
          retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
        });
      }

      // Add current request
      userRequests.push(now);
      requests.set(key, userRequests);

      next();
    };
  }
};

module.exports = {
  DataEncryption,
  privacyMiddleware
};