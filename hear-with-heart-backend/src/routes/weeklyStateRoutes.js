const express = require('express');
const createWeeklyStateController = require('../controllers/weeklyStateController');
const { authenticateToken } = require('../utils/auth');

function createWeeklyStateRoutes(jwtSecret) {
  const router = express.Router();
  const weeklyStateController = createWeeklyStateController();
  const requireAuth = authenticateToken(jwtSecret);

  router.get('/', requireAuth, weeklyStateController.getWeeklyState);
  router.put('/', requireAuth, weeklyStateController.saveWeeklyState);

  return router;
}

module.exports = createWeeklyStateRoutes;
