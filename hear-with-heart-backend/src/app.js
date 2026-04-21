const path = require('path');
const express = require('express');
const cors = require('cors');
const createAuthRoutes = require('./routes/authRoutes');
const createProfileRoutes = require('./routes/profileRoutes');
const createPrerequisiteRoutes = require('./routes/prerequisiteRoutes');
const createWeeklyPlanRoutes = require('./routes/weeklyPlanRoutes');
const createWeeklyStateRoutes = require('./routes/weeklyStateRoutes');
const createMilestoneRoutes = require('./routes/milestoneRoutes');

function createApp({ jwtSecret }) {
  const app = express();

  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'],
    credentials: true
  }));
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({
      name: 'HearWithHeart API',
      version: '1.0.0',
      status: 'running',
      message: 'Backend server is active. Please use the frontend application to interact with this API.'
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', createAuthRoutes(jwtSecret));
  app.use('/api/profile', createProfileRoutes(jwtSecret));
  app.use('/api/prerequisite', createPrerequisiteRoutes(jwtSecret));
  app.use('/api/weekly-plan', createWeeklyPlanRoutes(jwtSecret));
  app.use('/api/weekly-state', createWeeklyStateRoutes(jwtSecret));
  app.use('/api/milestones', createMilestoneRoutes(jwtSecret));



  return app;
}

module.exports = createApp;
