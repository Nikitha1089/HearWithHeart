const express = require('express');
const createAuthController = require('../controllers/authController');
const { authenticateToken } = require('../utils/auth');

function createAuthRoutes(jwtSecret) {
  const router = express.Router();
  const authController = createAuthController(jwtSecret);

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', authenticateToken(jwtSecret), authController.me);
  router.post('/logout', authController.logout);

  return router;
}

module.exports = createAuthRoutes;
