const Profile = require('../models/Profile');

function createWeeklyStateController() {
  async function getWeeklyState(req, res) {
    try {
      const profile = await Profile.findOne({ user: req.user.sub }).lean();

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      return res.json({
        weeklyState: profile.weeklyState || { completedSubtasks: [], updatedAt: null }
      });
    } catch (error) {
      console.error('Get weekly state error:', error);
      return res.status(500).json({ message: 'Server error while loading weekly state.' });
    }
  }

  async function saveWeeklyState(req, res) {
    try {
      const { completedSubtasks } = req.body || {};

      if (!Array.isArray(completedSubtasks)) {
        return res.status(400).json({ message: 'Completed subtasks must be an array.' });
      }

      const normalizedCompletedSubtasks = completedSubtasks
        .map((value) => String(value).trim())
        .filter(Boolean);

      const profile = await Profile.findOneAndUpdate(
        { user: req.user.sub },
        {
          $set: {
            weeklyState: {
              completedSubtasks: normalizedCompletedSubtasks,
              updatedAt: new Date()
            }
          }
        },
        { new: true }
      ).lean();

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found. Please save the profile first.' });
      }

      return res.json({
        message: 'Weekly state saved successfully.',
        weeklyState: profile.weeklyState || {
          completedSubtasks: normalizedCompletedSubtasks,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Save weekly state error:', error);
      return res.status(500).json({ message: 'Server error while saving weekly state.' });
    }
  }

  return {
    getWeeklyState,
    saveWeeklyState
  };
}

module.exports = createWeeklyStateController;
