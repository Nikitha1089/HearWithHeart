const express = require('express');
const createPrerequisiteController = require('../controllers/prerequisiteController');
const { authenticateToken } = require('../utils/auth');

function createPrerequisiteRoutes(jwtSecret) {
  const router = express.Router();
  const prerequisiteController = createPrerequisiteController();
  const requireAuth = authenticateToken(jwtSecret);

  router.get('/:type', requireAuth, prerequisiteController.getQuestions);
  router.get('/', requireAuth, prerequisiteController.getQuestions);
  router.post('/submit', requireAuth, prerequisiteController.submitPrerequisite);

  return router;
}

module.exports = createPrerequisiteRoutes;
