const Profile = require('../models/Profile');

function createMilestoneController() {
  async function getMilestones(req, res) {
    try {
      const profile = await Profile.findOne({ user: req.user.sub }).lean();
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      return res.json({
        milestones: profile.milestones || [],
        totalXP: profile.totalXP || 0,
        level: profile.level || 1,
        streakData: profile.streakData || { currentStreak: 0, longestStreak: 0 }
      });
    } catch (error) {
      console.error('Get milestones error:', error);
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  async function checkAndAward(req, res) {
    try {
      const profile = await Profile.findOne({ user: req.user.sub });
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      const awarded = [];
      const completedCount = (profile.weeklyState?.completedSubtasks || []).length;

      /* First task */
      if (completedCount >= 1 && !profile.milestones.includes('first_task')) {
        profile.milestones.push('first_task');
        awarded.push('first_task');
      }

      /* Full day (10 subtasks) */
      if (completedCount >= 10 && !profile.milestones.includes('full_day')) {
        profile.milestones.push('full_day');
        awarded.push('full_day');
      }

      /* All weekly tasks (70 subtasks) */
      if (completedCount >= 70 && !profile.milestones.includes('all_tasks')) {
        profile.milestones.push('all_tasks');
        awarded.push('all_tasks');
      }

      /* Update XP: 10 XP per completed subtask */
      const newXP = completedCount * 10;
      profile.totalXP = newXP;
      profile.level = Math.floor(newXP / 500) + 1;

      /* Streak tracking */
      const now = new Date();
      const lastActive = profile.streakData?.lastActiveDate;
      if (completedCount > 0) {
        if (!lastActive) {
          profile.streakData = { currentStreak: 1, longestStreak: 1, lastActiveDate: now };
        } else {
          const diffDays = Math.floor((now - new Date(lastActive)) / (1000 * 60 * 60 * 24));
          if (diffDays === 0) {
            /* Same day, no change */
          } else if (diffDays === 1) {
            const newStreak = (profile.streakData?.currentStreak || 0) + 1;
            profile.streakData.currentStreak = newStreak;
            profile.streakData.longestStreak = Math.max(profile.streakData?.longestStreak || 0, newStreak);
            profile.streakData.lastActiveDate = now;
          } else {
            profile.streakData.currentStreak = 1;
            profile.streakData.lastActiveDate = now;
          }
        }

        /* Streak milestones */
        const streak = profile.streakData?.currentStreak || 0;
        if (streak >= 7 && !profile.milestones.includes('streak_7')) {
          profile.milestones.push('streak_7');
          awarded.push('streak_7');
        }
        if (streak >= 14 && !profile.milestones.includes('dedicated')) {
          profile.milestones.push('dedicated');
          awarded.push('dedicated');
        }
        if (streak >= 30 && !profile.milestones.includes('streak_30')) {
          profile.milestones.push('streak_30');
          awarded.push('streak_30');
        }
      }

      await profile.save();

      return res.json({ awarded, milestones: profile.milestones, totalXP: profile.totalXP, level: profile.level });
    } catch (error) {
      console.error('Check milestones error:', error);
      return res.status(500).json({ message: 'Server error.' });
    }
  }

  return { getMilestones, checkAndAward };
}

module.exports = createMilestoneController;
