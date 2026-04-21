const Profile = require('../models/Profile');

function createProfileController() {
  async function saveProfile(req, res) {
    try {
      const { parent, student, disabilityTypes } = req.body || {};

      if (!parent || !student) {
        return res.status(400).json({ message: 'Parent and student details are required.' });
      }

      if (!parent.name || !parent.phone) {
        return res.status(400).json({ message: 'Parent name and phone are required.' });
      }

      if (!student.name || !student.age) {
        return res.status(400).json({ message: 'Student name and age are required.' });
      }

      const str = (v) => String(v || '').trim();

      const profile = await Profile.findOneAndUpdate(
        { user: req.user.sub },
        {
          $set: {
            user: req.user.sub,
            parent: {
              name: str(parent.name),
              age: str(parent.age),
              phone: str(parent.phone),
              relation: str(parent.relation),
              address: str(parent.address),
              state: str(parent.state)
            },
            student: {
              name: str(student.name),
              age: str(student.age),
              school: str(student.school),
              grade: str(student.grade),
              gender: str(student.gender),
              supportNeed: str(student.supportNeed),
              hobbies: str(student.hobbies)
            },
            disabilityTypes: Array.isArray(disabilityTypes) ? disabilityTypes.map(str) : []
          },
          $setOnInsert: {
            prerequisite: null,
            milestones: [],
            totalXP: 0,
            level: 1,
            streakData: { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
          }
        },
        { new: true, upsert: true, runValidators: true }
      );

      return res.status(201).json({
        message: 'Profile saved successfully.',
        profile
      });
    } catch (error) {
      console.error('Save profile error:', error);
      return res.status(500).json({ message: 'Server error while saving profile.' });
    }
  }

  async function getProfile(req, res) {
    try {
      const profile = await Profile.findOne({ user: req.user.sub }).lean();

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      return res.json({ profile });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Server error while loading profile.' });
    }
  }

  return {
    getProfile,
    saveProfile
  };
}

module.exports = createProfileController;
