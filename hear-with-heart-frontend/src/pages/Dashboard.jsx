import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, TrendingUp, Baby, Play, Quote, ChevronDown, Award, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { fetchWeeklyPlan, fetchWeeklyState, saveWeeklyState, checkMilestones } from '../api/client';
import { normalizeCategory, getTaskCompletion, getOverallProgress, getCompletedCount, getStreak, getDayLabel, getRandomQuote } from '../utils/helpers';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import PageTransition from '../components/layout/PageTransition';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, profile, hasPrerequisite, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(null);
  const [quote] = useState(getRandomQuote);
  const [confirmComplete, setConfirmComplete] = useState({ open: false, subtaskId: null, subtaskTitle: '' });

  const userName = profile?.parent?.name || user?.username || 'Parent';
  const childName = profile?.student?.name || 'Child';
  const category = profile?.prerequisite?.category || '';

  const loadData = useCallback(async () => {
    if (!hasPrerequisite) { setLoading(false); return; }
    setLoading(true);
    try {
      const cat = normalizeCategory(category);
      const planRes = await fetchWeeklyPlan(cat);
      setTasks(Array.isArray(planRes.tasks) ? planRes.tasks : []);
      const stateRes = await fetchWeeklyState().catch(() => ({ weeklyState: { completedSubtasks: [] } }));
      setCompleted(stateRes.weeklyState?.completedSubtasks || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setTasks([]);
      setCompleted([]);
    } finally {
      setLoading(false);
    }
  }, [hasPrerequisite, category]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!profile?.parent?.name) { navigate('/profile?fresh=1'); return; }
    if (!hasPrerequisite) { navigate('/assessment'); return; }
    loadData();
  }, [isAuthenticated, profile, hasPrerequisite, loadData, navigate]);

  const requestComplete = (subtaskId, subtaskTitle) => {
    if (completed.includes(subtaskId)) return;
    setConfirmComplete({ open: true, subtaskId, subtaskTitle });
  };

  const confirmSubtaskComplete = async () => {
    const { subtaskId } = confirmComplete;
    if (!subtaskId || completed.includes(subtaskId)) return;
    const next = [...completed, subtaskId];
    setCompleted(next);
    setConfirmComplete({ open: false, subtaskId: null, subtaskTitle: '' });
    try {
      const res = await saveWeeklyState(next);
      setCompleted(res.weeklyState?.completedSubtasks || next);
      await checkMilestones();
      toast('Task completed! Great job!', 'success');
    } catch {
      toast('Failed to save progress.', 'error');
    }
  };

  const overall = getOverallProgress(tasks, completed);
  const done = getCompletedCount(tasks, completed);
  const streak = getStreak(tasks, completed);
  const chartData = tasks.map((t, i) => ({ name: getDayLabel(i), progress: getTaskCompletion(t, completed) }));

  if (loading) {
    return (
      <PageTransition>
        <div className={`${styles.page} container`}>
          <div className={styles.loadingGrid}>
            {[...Array(4)].map((_, i) => <div key={i} className={`skeleton ${styles.skelCard}`} />)}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={`${styles.page} container`}>
        {/* Welcome */}
        <motion.div className={styles.welcome} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1>Welcome back, <span className="gradient-text">{userName}</span> 👋</h1>
            <p className={styles.welcomeSub}>Your consistency is making a real difference in {childName}'s growth.</p>
          </div>
          <ProgressRing progress={overall} size={90} stroke={7} />
        </motion.div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard} delay={0}>
            <Flame size={24} className={styles.statIconFire} />
            <h3><AnimatedCounter value={streak} /></h3>
            <p>Day Streak</p>
          </Card>
          <Card className={styles.statCard} delay={0.05}>
            <Baby size={24} className={styles.statIconChild} />
            <h3>{childName}</h3>
            <Badge variant={category === 'Excellent' ? 'success' : category === 'Poor' ? 'warning' : 'info'} size="sm">{category || '—'}</Badge>
          </Card>
          <Card className={styles.statCard} delay={0.1}>
            <TrendingUp size={24} className={styles.statIconProgress} />
            <h3><AnimatedCounter value={overall} suffix="%" /></h3>
            <p>Weekly Progress</p>
          </Card>
          <Card className={styles.statCard} delay={0.15}>
            <CheckCircle2 size={24} className={styles.statIconDone} />
            <h3><AnimatedCounter value={done} /></h3>
            <p>Tasks Completed</p>
          </Card>
        </div>

        {/* Quote */}
        <Card variant="gradient" className={styles.quoteCard} delay={0.2}>
          <Quote size={20} className={styles.quoteIcon} />
          <p>{quote}</p>
        </Card>

        {/* Chart */}
        <Card className={styles.chartCard} delay={0.25} hover={false}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp size={20} /> Weekly Progress
          </h2>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 13 }}
                  formatter={(v) => [`${v}%`, 'Completion']}
                />
                <Area type="monotone" dataKey="progress" stroke="var(--color-primary)" strokeWidth={3} fill="url(#progressGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tasks */}
        <h2 className={styles.sectionTitle}>
          <Play size={20} /> Weekly Tasks
        </h2>
        <div className={styles.tasksList}>
          {tasks.map((task, i) => {
            const pct = getTaskCompletion(task, completed);
            return (
              <Card
                key={task.id}
                className={`${styles.taskCard} ${pct === 100 ? styles.taskDone : ''}`}
                delay={0.05 * i}
                hover={false}
                onClick={() => setTaskModal(task)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.taskLeft}>
                  <span className={styles.taskNum}>{i + 1}</span>
                  <div>
                    <h4>{task.title}</h4>
                    {task.description && <p className={styles.taskDesc}>{task.description}</p>}
                  </div>
                </div>
                <div className={styles.taskRight}>
                  <Badge variant={pct === 100 ? 'success' : pct > 0 ? 'info' : 'default'}>{pct}%</Badge>
                  <ChevronDown size={16} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Task Modal */}
        <Modal
          open={Boolean(taskModal)}
          onClose={() => setTaskModal(null)}
          title={taskModal?.title}
          subtitle={`${getTaskCompletion(taskModal || {}, completed)}% complete`}
          wide
        >
          {taskModal?.subtasks?.map((sub, i) => {
            const checked = completed.includes(sub.id);
            return (
              <label key={sub.id} className={`${styles.subtask} ${checked ? styles.subtaskDone : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={checked}
                  onChange={() => requestComplete(sub.id, sub.title)}
                  className={styles.subtaskCheck}
                  title={checked ? 'Task completed' : 'Mark as complete'}
                />
                <div>
                  <div className={styles.subtaskTitle}>{i + 1}. {sub.title}</div>
                  {sub.help && <div className={styles.subtaskHelp}>{sub.help}</div>}
                </div>
              </label>
            );
          })}
        </Modal>

        {/* Confirm Complete Modal */}
        <ConfirmModal
          open={confirmComplete.open}
          onCancel={() => setConfirmComplete({ open: false, subtaskId: null, subtaskTitle: '' })}
          onConfirm={confirmSubtaskComplete}
          title="Lock this task?"
          message={`"${confirmComplete.subtaskTitle}" will be marked as completed and cannot be undone. This helps track real progress.`}
          confirmLabel="Yes, Complete Task"
          confirmVariant="success"
          variant="success"
          icon={Lock}
        />
      </div>
    </PageTransition>
  );
}
