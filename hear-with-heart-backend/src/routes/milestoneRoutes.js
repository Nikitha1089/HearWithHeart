const express = require('express');
const createMilestoneController = require('../controllers/milestoneController');
const { authenticateToken } = require('../utils/auth');

function createMilestoneRoutes(jwtSecret) {
  const router = express.Router();
  const controller = createMilestoneController();

  router.get('/', authenticateToken(jwtSecret), controller.getMilestones);
  router.post('/check', authenticateToken(jwtSecret), controller.checkAndAward);

  return router;
}

module.exports = createMilestoneRoutes;
