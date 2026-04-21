const API_BASE = '';

async function request(path, { method = 'GET', body } = {}) {
  const options = {
    method,
    credentials: 'include',
    headers: {}
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
}

/* ─── Auth ─── */
export const registerUser = (payload) =>
  request('/api/auth/register', { method: 'POST', body: payload });

export const loginUser = (payload) =>
  request('/api/auth/login', { method: 'POST', body: payload });

export const fetchCurrentUser = async () => {
  try {
    const data = await request('/api/auth/me');
    return data.user || null;
  } catch {
    return null;
  }
};

export const logoutUser = () =>
  request('/api/auth/logout', { method: 'POST' }).catch(() => {});

/* ─── Profile ─── */
export const saveProfile = (profile) =>
  request('/api/profile', { method: 'POST', body: profile }).then((d) => d.profile);

export const fetchProfile = async () => {
  try {
    const data = await request('/api/profile');
    return data.profile;
  } catch {
    return null;
  }
};

/* ─── Prerequisite / Assessment ─── */
export const fetchPrerequisiteQuestions = (type) =>
  request(`/api/prerequisite/${encodeURIComponent(type || 'both')}`);

export const submitPrerequisiteResult = (type, answers) =>
  request('/api/prerequisite/submit', { method: 'POST', body: { type, answers } });

/* ─── Weekly Plan ─── */
export const fetchWeeklyPlan = (category) =>
  request(`/api/weekly-plan/${encodeURIComponent(category || 'average')}`);

/* ─── Weekly State ─── */
export const fetchWeeklyState = () => request('/api/weekly-state');

export const saveWeeklyState = (completedSubtasks) =>
  request('/api/weekly-state', { method: 'PUT', body: { completedSubtasks } });

/* ─── Milestones ─── */
export const fetchMilestones = async () => {
  try {
    const data = await request('/api/milestones');
    return data.milestones || [];
  } catch {
    return [];
  }
};

export const checkMilestones = () =>
  request('/api/milestones/check', { method: 'POST' }).catch(() => ({ awarded: [] }));

/* ─── Helpers ─── */
export const formatAuthError = (err) =>
  err instanceof Error ? err.message : 'Something went wrong.';
