const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');

const planFileMap = {
  poor: 'poordata.json',
  average: 'averagedata.json',
  excellent: 'excellentdata.json'
};

function normalizeCategory(category = '') {
  const value = String(category).trim().toLowerCase();

  if (value === 'poor' || value === 'low') return 'poor';
  if (value === 'average' || value === 'good' || value === 'moderate') return 'average';
  if (value === 'excellent' || value === 'high') return 'excellent';

  return 'average';
}

function readJsonFile(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function normalizeSupportNeed(supportNeed = '') {
  const value = String(supportNeed).trim().toLowerCase();

  if (value.includes('hear')) return 'cannot_hear';
  if (value.includes('talk') || value.includes('speak')) return 'cannot_speak';
  if (value.includes('both')) return 'both';

  return 'both';
}

function getDisabilityKeyCandidates(supportNeed = '') {
  const normalized = normalizeSupportNeed(supportNeed);

  if (normalized === 'cannot_hear') {
    return ['cannot_hear'];
  }

  if (normalized === 'cannot_speak') {
    return ['cannot_speak'];
  }

  return ['both', 'cannot_hear_nor_speak'];
}

function pickTaskArray(payload, supportNeed = '') {
  if (Array.isArray(payload)) {
    return payload;
  }

  const candidateKeys = getDisabilityKeyCandidates(supportNeed);
  for (const key of candidateKeys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.sections)) {
    const section = payload.sections.find((entry) => {
      const title = String(entry?.title || '').toLowerCase();
      return candidateKeys.some((key) => title.includes(key.replace(/_/g, ' ')));
    }) || payload.sections[0];

    return Array.isArray(section?.main_tasks)
      ? section.main_tasks
      : Array.isArray(section?.tasks)
        ? section.tasks
        : [];
  }

  const arrayValues = Object.values(payload || {}).filter(Array.isArray);
  if (arrayValues.length > 0) {
    return arrayValues[0];
  }

  return [];
}

function normalizeSubtask(subtask, index) {
  return {
    id: String(subtask?.subtask_id || subtask?.id || `${index + 1}`),
    title: String(subtask?.what_to_do || subtask?.title || subtask?.text || `Subtask ${index + 1}`).trim(),
    help: String(subtask?.how_they_help || subtask?.help || subtask?.support || '').trim()
  };
}

function normalizeTask(task, index) {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : Array.isArray(task?.items) ? task.items : [];

  return {
    id: String(task?.main_task_id || task?.task_number || task?.id || `${index + 1}`),
    title: String(task?.main_task_name || task?.title || task?.name || `Task ${index + 1}`).trim(),
    description: String(task?.learns || task?.description || task?.summary || '').trim(),
    subtasks: subtasks.map(normalizeSubtask).filter((subtask) => subtask.title)
  };
}

function loadWeeklyPlan(category, supportNeed) {
  const normalizedCategory = normalizeCategory(category);
  const fileName = planFileMap[normalizedCategory];
  const payload = readJsonFile(fileName);
  const tasks = pickTaskArray(payload, supportNeed)
    .slice(0, 7)
    .map(normalizeTask)
    .filter((task) => task.title);

  return {
    category: normalizedCategory,
    tasks
  };
}

function createWeeklyPlanController() {
  async function getPlan(req, res) {
    try {
      const category = req.params.category || req.query.category || 'average';
      const profile = await Profile.findOne({ user: req.user.sub }).lean();
      const supportNeed = profile?.student?.supportNeed || 'Both';
      const plan = loadWeeklyPlan(category, supportNeed);

      return res.json({
        message: 'Weekly plan loaded successfully.',
        category: plan.category,
        supportNeed,
        tasks: plan.tasks
      });
    } catch (error) {
      console.error('Get weekly plan error:', error);
      return res.status(500).json({ message: 'Server error while loading weekly plan.' });
    }
  }

  return {
    getPlan
  };
}

module.exports = createWeeklyPlanController;
