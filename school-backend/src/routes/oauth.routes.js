const express = require('express');
const OAuth2Server = require('oauth2-server');
const OAuth2Model = require('../models/oauth2-model');

const router = express.Router();

// Initialize OAuth2 server
const oauth = new OAuth2Server({
  model: new OAuth2Model(),
  accessTokenLifetime: 3600, // 1 hour
  refreshTokenLifetime: 1209600, // 14 days
  allowBearerTokensInQueryString: true,
  allowEmptyState: true
});

// OAuth2 token endpoint
router.post('/token', async (req, res, next) => {
  try {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    const token = await oauth.token(request, response);
    res.json(token);
  } catch (error) {
    next(error);
  }
});

// OAuth2 authorize endpoint
router.get('/authorize', async (req, res, next) => {
  try {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    const authCode = await oauth.authorize(request, response, {
      authenticateHandler: {
        handle: (request, response) => {
          // This would typically redirect to a login page
          // For API integration, we'll assume the user is already authenticated
          return { id: 1, firstName: 'API', lastName: 'User', email: 'api@example.com', role: 'admin' };
        }
      }
    });

    res.json(authCode);
  } catch (error) {
    next(error);
  }
});

// Middleware to authenticate OAuth2 requests
const authenticateOAuth = (scopes = []) => {
  return async (req, res, next) => {
    try {
      const request = new OAuth2Server.Request(req);
      const response = new OAuth2Server.Response(res);

      const token = await oauth.authenticate(request, response, {
        scope: scopes.join(' ')
      });

      req.oauth = token;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: error.message
      });
    }
  };
};

// Export both router and middleware
module.exports = {
  router,
  authenticateOAuth
};