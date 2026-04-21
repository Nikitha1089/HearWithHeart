const express = require('express');
const createProfileController = require('../controllers/profileController');
const { authenticateToken } = require('../utils/auth');

function createProfileRoutes(jwtSecret) {
  const router = express.Router();
  const profileController = createProfileController();
  const requireAuth = authenticateToken(jwtSecret);

  router.get('/', requireAuth, profileController.getProfile);
  router.post('/', requireAuth, profileController.saveProfile);

  return router;
}

module.exports = createProfileRoutes;
