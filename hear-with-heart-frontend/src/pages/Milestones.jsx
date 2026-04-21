import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Award, Target, Zap, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/layout/PageTransition';
import styles from './Milestones.module.css';

const ACHIEVEMENTS = [
  { id: 'first_task', label: 'First Step', desc: 'Completed your first subtask', icon: Star, color: '#f59e0b' },
  { id: 'full_day', label: 'Full Day', desc: 'Completed all subtasks in a day', icon: Target, color: '#10b981' },
  { id: 'streak_7', label: '7-Day Streak', desc: 'Maintained a streak for 7 days', icon: Flame, color: '#f97316' },
  { id: 'streak_30', label: '30-Day Streak', desc: 'An incredible 30-day streak!', icon: Flame, color: '#ef4444' },
  { id: 'all_tasks', label: 'Home Therapist', desc: 'Completed all weekly tasks', icon: Trophy, color: '#8b5cf6' },
  { id: 'improved', label: 'Rising Star', desc: 'Assessment score improved', icon: Zap, color: '#3b82f6' },
  { id: 'dedicated', label: 'Dedicated Parent', desc: 'Logged in for 14 consecutive days', icon: Heart, color: '#f43f5e' },
  { id: 'explorer', label: 'Explorer', desc: 'Tried all activity categories', icon: Award, color: '#0d9488' }
];

export default function Milestones() {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const earned = profile?.milestones || [];

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const streakDays = profile?.streakData?.currentStreak || 0;
  const totalXP = profile?.totalXP || 0;
  const level = profile?.level || 1;

  return (
    <PageTransition>
      <div className={`${styles.page} container`}>
        <div className={styles.header}>
          <h1><Trophy size={28} /> Milestones & Achievements</h1>
          <p>Track your journey and celebrate every milestone along the way.</p>
        </div>

        {/* XP Bar */}
        <Card className={styles.xpCard} variant="gradient" delay={0}>
          <div className={styles.xpInfo}>
            <div className={styles.xpLevel}>
              <Zap size={20} />
              <span>Level {level}</span>
            </div>
            <span className={styles.xpCount}>{totalXP} XP</span>
          </div>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${Math.min((totalXP % 500) / 5, 100)}%` }} />
          </div>
          <p className={styles.xpHint}>{500 - (totalXP % 500)} XP to next level</p>
        </Card>

        {/* Streak */}
        <Card className={styles.streakCard} delay={0.05}>
          <motion.div
            className={styles.streakIcon}
            animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame size={40} />
          </motion.div>
          <div>
            <h2>{streakDays} Day Streak</h2>
            <p>Keep it going! Consistency is the key to your child's progress.</p>
          </div>
        </Card>

        {/* Badges Grid */}
        <h2 className={styles.sectionTitle}>Achievement Badges</h2>
        <div className={styles.badgesGrid}>
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = earned.includes(a.id);
            return (
              <Card
                key={a.id}
                delay={i * 0.05}
                className={`${styles.badgeCard} ${unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
              >
                <div className={styles.badgeIcon} style={{ '--badge-color': a.color }}>
                  <a.icon size={28} />
                </div>
                <h3>{a.label}</h3>
                <p>{a.desc}</p>
                {unlocked ? (
                  <Badge variant="success" size="sm">Earned</Badge>
                ) : (
                  <Badge variant="default" size="sm">Locked</Badge>
                )}
              </Card>
            );
          })}
        </div>

        {/* Timeline */}
        <h2 className={styles.sectionTitle}>Progress Timeline</h2>
        <div className={styles.timeline}>
          {profile?.prerequisite?.completedAt && (
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <Badge variant="primary" size="sm">Assessment</Badge>
                <h4>Prerequisite Completed</h4>
                <p>Category: {profile.prerequisite.category} — Score: {profile.prerequisite.score}</p>
                <span className={styles.timelineDate}>
                  {new Date(profile.prerequisite.completedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <Badge variant="info" size="sm">Profile</Badge>
              <h4>Profile Created</h4>
              <p>Child: {profile?.student?.name || '—'}</p>
              <span className={styles.timelineDate}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
