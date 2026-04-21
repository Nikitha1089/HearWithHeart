export function normalizeCategory(cat = '') {
  const v = String(cat).trim().toLowerCase();
  if (v === 'poor' || v === 'low' || v === 'needs attention') return 'poor';
  if (v === 'average' || v === 'moderate' || v === 'good') return 'average';
  if (v === 'excellent' || v === 'high') return 'excellent';
  return 'average';
}

export function badgeVariant(cat = '') {
  const v = normalizeCategory(cat);
  if (v === 'poor') return 'warning';
  if (v === 'excellent') return 'success';
  return 'info';
}

export function getTaskCompletion(task, completed = []) {
  const ids = (task?.subtasks || []).map((s) => String(s.id || ''));
  if (!ids.length) return 0;
  const done = ids.filter((id) => completed.includes(id)).length;
  return Math.round((done / ids.length) * 100);
}

export function getOverallProgress(tasks, completed = []) {
  if (!tasks.length) return 0;
  const total = tasks.reduce((s, t) => s + getTaskCompletion(t, completed), 0);
  return Math.round(total / tasks.length);
}

export function getCompletedCount(tasks, completed = []) {
  return tasks.filter((t) => getTaskCompletion(t, completed) === 100).length;
}

export function getStreak(tasks, completed = []) {
  let streak = 0;
  for (const t of tasks) {
    if (getTaskCompletion(t, completed) === 100) streak++;
    else break;
  }
  return streak;
}

export function getDayLabel(index) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[index] || `Day ${index + 1}`;
}

export function truncate(str, len = 30) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

const QUOTES = [
  "Your love and patience are the strongest therapy your child can receive.",
  "Every small step is a big victory! Keep going, you're doing amazing! 🌟",
  "Progress is not always visible, but it's always happening.",
  "You are your child's greatest advocate and first teacher.",
  "Consistency, not perfection — that's the secret to growth.",
  "A parent's gentle guidance can move mountains.",
  "Celebrate every milestone, no matter how small it seems.",
  "The journey of a thousand miles begins with a single step.",
  "Your dedication today shapes your child's tomorrow.",
  "Every child blooms at their own pace. Trust the process. 🌻"
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/**
 * Disability Types Registry
 * ─────────────────────────
 * Each entry carries:
 *   id       – unique string key stored in DB
 *   label    – human-readable label
 *   icon     – lucide-react icon name
 *   color    – accent colour for the card
 *   category – logical grouping (used for combination validation)
 *   desc     – short description shown as tooltip/subtitle
 */
export const DISABILITY_TYPES = [
  /* ── Sensory ── */
  {
    id: 'hearing',
    label: "Hearing Impairment",
    icon: 'Ear',
    color: '#8b5cf6',
    category: 'sensory',
    desc: "Partial or complete inability to hear",
  },
  {
    id: 'speech',
    label: "Speech / Language Delay",
    icon: 'MessageCircleOff',
    color: '#ec4899',
    category: 'sensory',
    desc: "Difficulty producing or understanding speech",
  },
  {
    id: 'visual',
    label: "Visual Impairment",
    icon: 'EyeOff',
    color: '#7c3aed',
    category: 'sensory',
    desc: "Low vision or blindness",
  },
  /* ── Neurological / Cognitive ── */
  {
    id: 'cognitive',
    label: "Cognitive / Intellectual Delay",
    icon: 'Brain',
    color: '#3b82f6',
    category: 'cognitive',
    desc: "Significant limitations in intellectual functioning",
  },
  {
    id: 'autism',
    label: "Autism Spectrum (ASD)",
    icon: 'Infinity',
    color: '#06b6d4',
    category: 'cognitive',
    desc: "Neurodevelopmental condition affecting social interaction",
  },
  {
    id: 'adhd',
    label: "ADHD / Attention Deficit",
    icon: 'Zap',
    color: '#f59e0b',
    category: 'cognitive',
    desc: "Challenges with attention, impulse control & hyperactivity",
  },
  /* ── Physical / Motor ── */
  {
    id: 'motor_fine',
    label: "Fine Motor Difficulty",
    icon: 'Hand',
    color: '#10b981',
    category: 'motor',
    desc: "Difficulty with precise hand/finger movements",
  },
  {
    id: 'motor_gross',
    label: "Gross Motor / Mobility",
    icon: 'Accessibility',
    color: '#14b8a6',
    category: 'motor',
    desc: "Difficulty with walking, balance or large-body movements",
  },
  {
    id: 'cerebral_palsy',
    label: "Cerebral Palsy",
    icon: 'Activity',
    color: '#0ea5e9',
    category: 'motor',
    desc: "Affecting movement and muscle coordination",
  },
  /* ── Socio-Emotional ── */
  {
    id: 'socio_emotional',
    label: "Socio-Emotional Need",
    icon: 'Heart',
    color: '#f43f5e',
    category: 'emotional',
    desc: "Challenges with emotions, social interaction, or behaviour",
  },
  {
    id: 'anxiety',
    label: "Anxiety / Selective Mutism",
    icon: 'ShieldAlert',
    color: '#fb923c',
    category: 'emotional',
    desc: "Persistent anxiety or situation-specific loss of speech",
  },
];

/**
 * Rules for disability combinations that are physically / clinically
 * impossible or highly improbable.  Each rule fires a warning when
 * the user selects a flagged combination.
 *
 * Format: { ids: string[], message: string }
 *   ids      – array of disability IDs; warning fires when ALL are selected
 *   message  – human-readable explanation shown to user
 */
export const DISABILITY_CONFLICT_RULES = [
  {
    ids: ['hearing', 'speech'],
    message:
      "Hearing impairment and speech/language delay often co-occur — but please note that 'Hearing Impairment' covers inability to hear, while 'Speech Delay' covers inability to produce speech. A child can have either or both. If both apply, this is completely valid!",
    severity: 'info',
  },
  {
    ids: ['visual', 'autism'],
    message:
      "Visual impairment and autism can co-occur (called 'dual diagnosis'), though it is uncommon. Please confirm with a clinician that both diagnoses are present.",
    severity: 'warn',
  },
  {
    ids: ['adhd', 'cognitive'],
    message:
      "ADHD and intellectual/cognitive delay are distinct conditions. ADHD alone does not cause intellectual disability. Please confirm both diagnoses with a specialist.",
    severity: 'warn',
  },
  {
    ids: ['anxiety', 'hearing'],
    message:
      "Anxiety-related selective mutism is different from hearing impairment. A child with selective mutism can hear normally but chooses not to speak in certain situations. These rarely co-occur — please double-check.",
    severity: 'warn',
  },
  {
    ids: ['cerebral_palsy', 'motor_fine', 'motor_gross'],
    message:
      "Cerebral Palsy already encompasses both fine and gross motor difficulties. You do not need to select the individual motor categories separately.",
    severity: 'info',
  },
];

export const GOVT_SCHEMES = [
  { name: 'ADIP Scheme', desc: 'Assistance to Disabled Persons for procuring aids and appliances', url: 'https://www.disabilityaffairs.gov.in' },
  { name: 'UDID Card', desc: 'Unique Disability ID for persons with disabilities', url: 'https://www.swavlambancard.gov.in' },
  { name: 'Niramaya Health ID', desc: 'Health insurance scheme for persons with disabilities', url: 'https://thenationaltrust.gov.in' },
  { name: 'RBSK Program', desc: 'Rashtriya Bal Swasthya Karyakram – Child health screening', url: 'https://rbsk.gov.in' },
  { name: 'National Trust', desc: 'Government body supporting persons with autism, cerebral palsy, intellectual disability', url: 'https://thenationaltrust.gov.in' },
  { name: 'AYJNISHD', desc: 'Ali Yavar Jung National Institute of Speech & Hearing Disabilities, Mumbai', url: 'https://ayjnishd.nic.in' }
];

export const EXPERT_TIPS = [
  { title: "Use Everyday Objects", body: "Spoons, cups, and towels can be powerful learning tools. Let your child explore textures and sizes." },
  { title: "Follow the Child's Lead", body: "Watch what interests your child and build activities around that. Interest drives engagement." },
  { title: "Keep Sessions Short", body: "10–15 minute sessions are more effective than long exhausting ones. Quality over quantity." },
  { title: "Celebrate Small Wins", body: "Every new gesture, sound, or movement is worth celebrating. Your enthusiasm is contagious." },
  { title: "Use Visual Schedules", body: "Pictures showing the daily routine help children understand what comes next and feel secure." },
  { title: "Make Eye Contact", body: "Get to your child's eye level. This builds connection and makes communication easier." },
  { title: "Repeat, Repeat, Repeat", body: "Repetition is how children learn. Don't worry if you need to show something many times." },
  { title: "Involve Siblings", body: "Siblings can be the best teachers. Include them in activities for natural social learning." }
];
