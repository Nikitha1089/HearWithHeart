import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, ClipboardList, AlertTriangle,
  Trophy, Check, Lock, ShieldCheck, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { fetchPrerequisiteQuestions, submitPrerequisiteResult } from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';
import PageTransition from '../components/layout/PageTransition';
import styles from './Assessment.module.css';

export default function Assessment() {
  const { profile, refreshProfile, isAuthenticated, hasPrerequisite } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(false);

  /* ── Redirect if assessment already completed (locked) ── */
  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    // If no profile filled yet, send them to profile first
    if (isAuthenticated && !profile?.parent?.name) {
      toast('Please complete your profile before taking the assessment.', 'error');
      navigate('/profile?fresh=1');
      return;
    }
    // If already completed, do NOT re-fetch questions (show locked screen)
    if (hasPrerequisite) { setLoaded(true); return; }

    const supportNeed = profile?.student?.supportNeed || 'Both';
    fetchPrerequisiteQuestions(supportNeed)
      .then((data) => {
        setQuestions(data.questions || []);
        setLoaded(true);
      })
      .catch(() => toast('Could not load assessment.', 'error'));
  }, [isAuthenticated, profile, navigate, toast, hasPrerequisite]);

  const select = (qId, optIdx) =>
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));

  const handleSubmit = async () => {
    const ansArr = questions.map((q) => ({
      questionId: q.id,
      optionIndex: answers[String(q.id)],
    }));
    if (ansArr.some((a) => a.optionIndex === undefined)) {
      toast('Please answer all questions before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const supportNeed = profile?.student?.supportNeed || 'Both';
      const res = await submitPrerequisiteResult(supportNeed, ansArr);
      setResult(res.result);
      await refreshProfile();
      toast('Assessment submitted successfully!', 'success');
    } catch (err) {
      toast(err.message || 'Failed to submit.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = questions.length
    ? Math.round((Object.keys(answers).length / questions.length) * 100)
    : 0;
  const q = questions[current];

  /* ─── LOADING SKELETON ─── */
  if (!loaded) {
    return (
      <PageTransition>
        <div className={`${styles.page} container`}>
          <div className={`skeleton ${styles.skelFull}`} />
          <div className={`skeleton ${styles.skelFull}`} style={{ marginTop: '1rem', height: '200px' }} />
        </div>
      </PageTransition>
    );
  }

  /* ─── ASSESSMENT ALREADY COMPLETED (LOCKED) ─── */
  if (hasPrerequisite && !result) {
    const prereq = profile?.prerequisite;
    const isLow = prereq?.category === 'Poor' || prereq?.score <= 25;
    return (
      <PageTransition>
        <div className={styles.centerWrap}>
          <div className={`${styles.page} container`}>
            <motion.div
              className={styles.lockedCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.lockedIconWrap}>
                <Lock size={32} />
              </div>
              <h1>Assessment Completed</h1>
              <p className={styles.lockedSubtitle}>
                You have already completed the prerequisite assessment. Your weekly activities
                are personalised based on the result below.
              </p>

              <div className={styles.resultStats}>
                <div className={styles.resultStat}>
                  <span>Score</span>
                  <strong>{prereq?.score ?? '—'}</strong>
                </div>
                <div className={styles.resultStat}>
                  <span>Category</span>
                  <Badge
                    variant={
                      prereq?.category === 'Excellent' ? 'success' :
                      prereq?.category === 'Poor' ? 'warning' : 'info'
                    }
                    size="lg"
                  >
                    {prereq?.category ?? '—'}
                  </Badge>
                </div>
                {prereq?.completedAt && (
                  <div className={styles.resultStat}>
                    <span>Completed On</span>
                    <strong>{new Date(prereq.completedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</strong>
                  </div>
                )}
              </div>

              {isLow && (
                <div className={styles.referral}>
                  <AlertTriangle size={18} />
                  <p>
                    Based on the score, we gently suggest consulting a professional therapist
                    for a detailed evaluation. Early intervention makes a huge difference.
                  </p>
                </div>
              )}

              <div className={styles.lockedNotice}>
                <ShieldCheck size={16} />
                <span>
                  To maintain fair, personalised recommendations, the assessment can only be submitted once.
                  If you believe there was an error, please contact our support team.
                </span>
              </div>

              <div className={styles.resultActions}>
                <Button onClick={() => navigate('/dashboard')} icon={LayoutDashboard}>
                  Go to Dashboard
                </Button>
                <Button variant="secondary" onClick={() => navigate('/profile')}>
                  View Profile
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ─── RESULT SCREEN (just submitted) ─── */
  if (result) {
    const isLow = result.category === 'Poor' || result.score <= 25;
    return (
      <PageTransition>
        <div className={`${styles.page} container`}>
          <motion.div
            className={styles.resultCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Trophy size={52} className={styles.resultIcon} />
            <h1>Assessment Complete!</h1>
            <p className={styles.resultSubtitle}>
              Great job! Your child's activities will now be tailored based on this result.
            </p>

            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span>Score</span>
                <strong>{result.score}</strong>
              </div>
              <div className={styles.resultStat}>
                <span>Category</span>
                <Badge
                  variant={result.category === 'Excellent' ? 'success' : result.category === 'Poor' ? 'warning' : 'info'}
                  size="lg"
                >
                  {result.category}
                </Badge>
              </div>
            </div>

            {isLow && (
              <div className={styles.referral}>
                <AlertTriangle size={18} />
                <p>
                  Based on the score, we gently suggest consulting a professional therapist
                  for a detailed evaluation. Early intervention makes a huge difference.
                </p>
              </div>
            )}

            <p className={styles.resultNote}>
              Your weekly tasks are now personalised. The assessment is now locked — this ensures
              consistent, accurate activity recommendations.
            </p>

            <div className={styles.resultActions}>
              <Button onClick={() => navigate('/dashboard')} icon={ChevronRight}>
                Start Activities
              </Button>
              <Button variant="secondary" onClick={() => navigate('/profile')}>
                View Profile
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  /* ─── ACTIVE ASSESSMENT ─── */
  return (
    <PageTransition>
      <div className={`${styles.page} container`}>
        <div className={styles.header}>
          <div>
            <h1><ClipboardList size={28} /> Prerequisite Assessment</h1>
            <p>Answer each question honestly to evaluate your child's current developmental level.</p>
          </div>
          <ProgressRing progress={progress} size={64} stroke={5} />
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressLabel}>
          Question {current + 1} of {questions.length}
          {Object.keys(answers).length > 0 && (
            <span className={styles.answeredHint}>
              · {Object.keys(answers).length} answered
            </span>
          )}
        </p>

        <AnimatePresence mode="wait">
          {q && (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <Card className={styles.questionCard}>
                <h2>{q.id}. {q.question}</h2>
                <div className={styles.options}>
                  {q.options.map((opt, idx) => {
                    const selected = answers[String(q.id)] === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.97 }}
                        className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                        onClick={() => select(String(q.id), idx)}
                      >
                        <span className={styles.optionDot}>
                          {selected ? <Check size={14} /> : null}
                        </span>
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.navRow}>
          <Button
            variant="ghost"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            icon={ChevronLeft}
          >
            Previous
          </Button>
          {current < questions.length - 1 ? (
            <Button
              onClick={() => setCurrent((c) => c + 1)}
              icon={ChevronRight}
              disabled={answers[String(q?.id)] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} icon={Check}>
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
