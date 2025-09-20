const OAuthClient = require('./OAuthClient');
const OAuthAccessToken = require('./OAuthAccessToken');
const OAuthRefreshToken = require('./OAuthRefreshToken');
const User = require('./User');

class OAuth2Model {
  // Get client by clientId
  async getClient(clientId, clientSecret) {
    try {
      const client = await OAuthClient.findOne({
        where: { clientId }
      });

      if (!client) {
        return false;
      }

      if (clientSecret && client.clientSecret !== clientSecret) {
        return false;
      }

      return {
        id: client.id,
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        grants: client.grants,
        redirectUris: client.redirectUris,
        scope: client.scope
      };
    } catch (error) {
      console.error('Error getting OAuth client:', error);
      return false;
    }
  }

  // Save token
  async saveToken(token, client, user) {
    try {
      // Save access token
      const accessToken = await OAuthAccessToken.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        userId: user.id,
        clientId: client.id
      });

      // Save refresh token if provided
      let refreshToken = null;
      if (token.refreshToken) {
        refreshToken = await OAuthRefreshToken.create({
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: token.refreshTokenExpiresAt,
          scope: token.scope,
          userId: user.id,
          clientId: client.id
        });
      }

      return {
        accessToken: accessToken.accessToken,
        accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
        refreshToken: refreshToken ? refreshToken.refreshToken : null,
        refreshTokenExpiresAt: refreshToken ? refreshToken.refreshTokenExpiresAt : null,
        scope: token.scope,
        client: { id: client.id, clientId: client.clientId },
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error saving OAuth token:', error);
      throw error;
    }
  }

  // Get access token
  async getAccessToken(accessToken) {
    try {
      const token = await OAuthAccessToken.findOne({
        where: { accessToken },
        include: [
          { model: User, as: 'user' },
          { model: OAuthClient, as: 'client' }
        ]
      });

      if (!token) {
        return false;
      }

      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        client: {
          id: token.client.id,
          clientId: token.client.clientId,
          clientSecret: token.client.clientSecret
        },
        user: {
          id: token.user.id,
          firstName: token.user.firstName,
          lastName: token.user.lastName,
          email: token.user.email,
          role: token.user.role
        }
      };
    } catch (error) {
      console.error('Error getting access token:', error);
      return false;
    }
  }

  // Get refresh token
  async getRefreshToken(refreshToken) {
    try {
      const token = await OAuthRefreshToken.findOne({
        where: { refreshToken },
        include: [
          { model: User, as: 'user' },
          { model: OAuthClient, as: 'client' }
        ]
      });

      if (!token) {
        return false;
      }

      return {
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client: {
          id: token.client.id,
          clientId: token.client.clientId,
          clientSecret: token.client.clientSecret
        },
        user: {
          id: token.user.id,
          firstName: token.user.firstName,
          lastName: token.user.lastName,
          email: token.user.email,
          role: token.user.role
        }
      };
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return false;
    }
  }

  // Revoke token
  async revokeToken(token) {
    try {
      if (token.refreshToken) {
        await OAuthRefreshToken.destroy({
          where: { refreshToken: token.refreshToken }
        });
      }

      await OAuthAccessToken.destroy({
        where: { accessToken: token.accessToken }
      });

      return true;
    } catch (error) {
      console.error('Error revoking token:', error);
      return false;
    }
  }

  // Verify scope
  async verifyScope(token, scope) {
    if (!token.scope) {
      return false;
    }
    const requestedScopes = scope.split(' ');
    const authorizedScopes = token.scope.split(' ');
    return requestedScopes.every(s => authorizedScopes.includes(s));
  }

  // Get user from client credentials
  async getUserFromClient(client) {
    // For client credentials grant, we don't need a user
    return {};
  }

  // Get user by username and password
  async getUser(username, password) {
    try {
      const user = await User.findOne({
        where: { email: username }
      });

      if (!user) {
        return false;
      }

      const isValidPassword = await user.matchPassword(password);
      if (!isValidPassword) {
        return false;
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return false;
    }
  }
}

module.exports = OAuth2Model;