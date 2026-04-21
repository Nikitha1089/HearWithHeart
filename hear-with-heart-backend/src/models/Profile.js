const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    parent: {
      name: { type: String, trim: true, maxlength: 80 },
      age: { type: String, trim: true, maxlength: 10 },
      phone: { type: String, trim: true, maxlength: 20 },
      relation: { type: String, trim: true, maxlength: 30 },
      address: { type: String, trim: true, maxlength: 120 },
      state: { type: String, trim: true, maxlength: 60 }
    },
    student: {
      name: { type: String, trim: true, maxlength: 80 },
      age: { type: String, trim: true, maxlength: 10 },
      school: { type: String, trim: true, maxlength: 120 },
      grade: { type: String, trim: true, maxlength: 40 },
      gender: { type: String, trim: true, maxlength: 20 },
      supportNeed: { type: String, trim: true, maxlength: 40 },
      hobbies: { type: String, trim: true, maxlength: 140 }
    },
    disabilityTypes: [
      { type: String, trim: true, maxlength: 30 }
    ],
    prerequisite: {
      type: {
        type: String,
        trim: true,
        maxlength: 40
      },
      score: {
        type: Number
      },
      category: {
        type: String,
        trim: true,
        maxlength: 20
      },
      answers: [
        {
          questionId: Number,
          question: String,
          answer: String,
          score: Number
        }
      ],
      completedAt: {
        type: Date
      }
    },
    weeklyState: {
      completedSubtasks: [
        {
          type: String,
          trim: true
        }
      ],
      updatedAt: {
        type: Date
      }
    },
    milestones: [
      { type: String, trim: true }
    ],
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakData: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
