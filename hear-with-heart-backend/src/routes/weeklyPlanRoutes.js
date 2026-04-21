const express = require('express');
const createWeeklyPlanController = require('../controllers/weeklyPlanController');
const { authenticateToken } = require('../utils/auth');

function createWeeklyPlanRoutes(jwtSecret) {
  const router = express.Router();
  const weeklyPlanController = createWeeklyPlanController();
  const requireAuth = authenticateToken(jwtSecret);

  router.get('/:category', requireAuth, weeklyPlanController.getPlan);
  router.get('/', requireAuth, weeklyPlanController.getPlan);

  return router;
}

module.exports = createWeeklyPlanRoutes;
