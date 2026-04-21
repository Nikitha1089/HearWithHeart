const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');

const prerequisitePath = path.join(__dirname, '..', 'data', 'Prerequisite.json');
const prerequisiteData = JSON.parse(fs.readFileSync(prerequisitePath, 'utf8'));

function normalizeType(type = '') {
  const value = String(type).trim().toLowerCase();

  if (value === 'cant_hear' || value === "can't hear" || value === 'hearing' || value === 'hear') {
    return 'cant_hear';
  }

  if (value === 'cant_talk' || value === "can't talk" || value === 'speech' || value === 'talk') {
    return 'cant_talk';
  }

  return 'both';
}

function getCategoryConfig(type) {
  const normalizedType = normalizeType(type);
  return prerequisiteData.categories.find((entry) => entry.type === normalizedType) || prerequisiteData.categories[2];
}

function parseRange(rangeText) {
  const [min, max] = String(rangeText)
    .split('-')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));

  return { min, max };
}

function categorizeScore(score) {
  const poor = parseRange(prerequisiteData.evaluation.poor);
  const average = parseRange(prerequisiteData.evaluation.average);
  const excellent = parseRange(prerequisiteData.evaluation.excellent);

  if (score >= poor.min && score <= poor.max) return 'Poor';
  if (score >= average.min && score <= average.max) return 'Average';
  if (score >= excellent.min && score <= excellent.max) return 'Excellent';
  return 'Average';
}

function createPrerequisiteController() {
  async function getQuestions(req, res) {
    try {
      const type = req.query.type || req.params.type;
      const category = getCategoryConfig(type);

      return res.json({
        type: category.type,
        questions: category.questions,
        evaluation: prerequisiteData.evaluation
      });
    } catch (error) {
      console.error('Get prerequisite error:', error);
      return res.status(500).json({ message: 'Server error while loading prerequisites.' });
    }
  }

  async function submitPrerequisite(req, res) {
    try {
      const { type, answers } = req.body || {};
      const category = getCategoryConfig(type);

      if (!Array.isArray(answers) || answers.length !== category.questions.length) {
        return res.status(400).json({ message: 'Please answer every prerequisite question.' });
      }

      let totalScore = 0;
      const normalizedAnswers = [];

      for (const question of category.questions) {
        const answer = answers.find((item) => Number(item.questionId) === Number(question.id));

        if (!answer) {
          return res.status(400).json({ message: 'Please answer every prerequisite question.' });
        }

        const selectedOption = question.options[Number(answer.optionIndex)];
        if (!selectedOption) {
          return res.status(400).json({ message: 'Invalid prerequisite answer selection.' });
        }

        totalScore += Number(selectedOption.score) || 0;
        normalizedAnswers.push({
          questionId: question.id,
          question: question.question,
          answer: selectedOption.text,
          score: selectedOption.score
        });
      }

      const resultCategory = categorizeScore(totalScore);

      const profile = await Profile.findOneAndUpdate(
        { user: req.user.sub },
        {
          $set: {
            user: req.user.sub,
            prerequisite: {
              type: category.type,
              score: totalScore,
              category: resultCategory,
              answers: normalizedAnswers,
              completedAt: new Date()
            }
          }
        },
        { new: true, upsert: true, runValidators: true }
      ).lean();

      return res.json({
        message: 'Prerequisite saved successfully.',
        result: {
          score: totalScore,
          category: resultCategory
        },
        profile
      });
    } catch (error) {
      console.error('Submit prerequisite error:', error);
      return res.status(500).json({ message: 'Server error while saving prerequisite.' });
    }
  }

  return {
    getQuestions,
    submitPrerequisite
  };
}

module.exports = createPrerequisiteController;
