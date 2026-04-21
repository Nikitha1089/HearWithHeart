import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, User, Baby,
  Accessibility, Save, AlertTriangle, Info,
  Lock, ClipboardCheck, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageTransition from '../components/layout/PageTransition';
import { DISABILITY_TYPES, DISABILITY_CONFLICT_RULES } from '../utils/helpers';
import * as Icons from 'lucide-react';
import styles from './Profile.module.css';

const STEPS = ['Parent Details', 'Child Details', 'Support Needs'];

/** Groups disability types by category for display */
const CATEGORY_META = {
  sensory:   { label: 'Sensory', color: '#8b5cf6' },
  cognitive: { label: 'Cognitive / Neurological', color: '#3b82f6' },
  motor:     { label: 'Physical / Motor', color: '#10b981' },
  emotional: { label: 'Socio-Emotional', color: '#f43f5e' },
};

export default function Profile() {
  const { profile, saveProfile, refreshProfile, isAuthenticated, hasPrerequisite } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isFresh = params.has('fresh');

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState(!isFresh && Boolean(profile?.parent?.name));

  const [parent, setParent] = useState({
    name: '', age: '', phone: '', relation: '', address: '', state: ''
  });
  const [student, setStudent] = useState({
    name: '', age: '', school: '', grade: '', gender: '', hobbies: ''
  });
  const [disabilityTypes, setDisabilityTypes] = useState([]);

  /* ── Pre-fill from saved profile ── */
  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (profile) {
      setParent((p) => ({
        name:     profile.parent?.name     || p.name,
        age:      profile.parent?.age      || p.age,
        phone:    profile.parent?.phone    || p.phone,
        relation: profile.parent?.relation || p.relation,
        address:  profile.parent?.address  || p.address,
        state:    profile.parent?.state    || p.state,
      }));
      setStudent((s) => ({
        name:   profile.student?.name   || s.name,
        age:    profile.student?.age    || s.age,
        school: profile.student?.school || s.school,
        grade:  profile.student?.grade  || s.grade,
        gender: profile.student?.gender || s.gender,
        hobbies:profile.student?.hobbies|| s.hobbies,
      }));
      if (profile.disabilityTypes) setDisabilityTypes(profile.disabilityTypes);
      if (!isFresh && profile.parent?.name) setViewMode(true);
    }
  }, [profile, isAuthenticated, navigate, isFresh]);

  /* ── Disability conflict detection ── */
  const conflicts = useMemo(() => {
    return DISABILITY_CONFLICT_RULES.filter((rule) =>
      rule.ids.every((id) => disabilityTypes.includes(id))
    );
  }, [disabilityTypes]);

  const pField = (key, val) => setParent((p) => ({ ...p, [key]: val }));
  const sField = (key, val) => setStudent((s) => ({ ...s, [key]: val }));

  const toggleDisability = (id) => {
    setDisabilityTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  /* ── Derive supportNeed from selections ── */
  const deriveSupportNeed = (types) => {
    const has = (id) => types.includes(id);
    if (has('hearing') && has('speech')) return 'Both';
    if (has('hearing'))  return "Can't Hear";
    if (has('speech'))   return "Can't Talk";
    if (types.length > 0) return 'Other';
    return 'Both';
  };

  const handleSave = async () => {
    if (!parent.name || !parent.phone || !student.name || !student.age) {
      toast('Please fill all required fields.', 'error');
      return;
    }
    if (disabilityTypes.length === 0) {
      toast('Please select at least one support need.', 'error');
      setStep(2);
      return;
    }
    const supportNeed = deriveSupportNeed(disabilityTypes);
    setSaving(true);
    try {
      await saveProfile({ parent, student: { ...student, supportNeed }, disabilityTypes });
      toast('Profile saved successfully!', 'success');
      setViewMode(true);
    } catch (err) {
      toast(err.message || 'Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────────
     VIEW MODE (profile already filled)
  ───────────────────────────────────────── */
  if (viewMode) {
    return (
      <PageTransition>
        <div className={`${styles.page} container`}>
          <div className={styles.viewHeader}>
            <div>
              <h1>Family Profile</h1>
              <p className={styles.viewSubtitle}>
                {profile?.student?.name
                  ? `Viewing ${profile.student.name}'s profile`
                  : 'Your saved profile details'}
              </p>
            </div>
            <Button variant="secondary" icon={Save} onClick={() => { setViewMode(false); setStep(0); }}>
              Edit Profile
            </Button>
          </div>

          <div className={styles.viewGrid}>
            {/* Parent card */}
            <Card className={styles.viewCard} delay={0}>
              <h3><User size={18} /> Parent / Guardian</h3>
              <div className={styles.infoGrid}>
                {Object.entries(parent).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className={styles.infoItem}>
                    <span className={styles.infoLabel}>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                    <span className={styles.infoValue}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Child card */}
            <Card className={styles.viewCard} delay={0.1}>
              <h3><Baby size={18} /> Child Details</h3>
              <div className={styles.infoGrid}>
                {Object.entries(student).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      {k === 'supportNeed' ? 'Support Need' : k.charAt(0).toUpperCase() + k.slice(1)}
                    </span>
                    <span className={styles.infoValue}>{v}</span>
                  </div>
                ))}
              </div>
              {disabilityTypes.length > 0 && (
                <div className={styles.badgeRow}>
                  {disabilityTypes.map((id) => {
                    const dt = DISABILITY_TYPES.find((d) => d.id === id);
                    return dt ? (
                      <Badge key={id} variant="primary" style={{ '--badge-color': dt.color }}>
                        {dt.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* ── Assessment Status ── */}
          {hasPrerequisite ? (
            <Card variant="primary" delay={0.2} className={styles.assessmentCard}>
              <div className={styles.assessmentHeader}>
                <ClipboardCheck size={22} className={styles.assessmentIcon} />
                <div>
                  <h3>Assessment Completed</h3>
                  <p>
                    Category: <strong>{profile.prerequisite.category}</strong>&nbsp;&nbsp;
                    Score: <strong>{profile.prerequisite.score}</strong>
                  </p>
                </div>
                <Badge
                  variant={
                    profile.prerequisite.category === 'Excellent' ? 'success' :
                    profile.prerequisite.category === 'Poor' ? 'warning' : 'info'
                  }
                  size="lg"
                >
                  {profile.prerequisite.category}
                </Badge>
              </div>

              <div className={styles.assessmentLocked}>
                <Lock size={14} />
                <span>
                  Assessment is locked. Your weekly tasks are personalised based on this result.
                  Contact support if you need a re-evaluation.
                </span>
              </div>
            </Card>
          ) : (
            <Card delay={0.2} className={styles.assessmentPromptCard}>
              <div className={styles.assessmentPromptInner}>
                <div>
                  <h3>Take the Prerequisite Assessment</h3>
                  <p>Answer a short evaluation to personalise your child's weekly activities.</p>
                </div>
                <Button onClick={() => navigate('/assessment')} icon={ChevronRight}>
                  Start Assessment
                </Button>
              </div>
            </Card>
          )}

          <div className={styles.viewActions}>
            <Button variant="secondary" icon={LayoutDashboard} onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ─────────────────────────────────────────
     EDIT / CREATE MODE  (multi-step flow)
  ───────────────────────────────────────── */
  return (
    <PageTransition>
      <div className={`${styles.page} container`}>
        {/* Step Indicators */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`${styles.step} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
            >
              <div className={styles.stepDot}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 0: Parent Details ── */}
          {step === 0 && (
            <motion.div key="parent" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className={styles.formCard}>
                <h2><User size={22} /> Parent / Guardian Details</h2>
                <p className={styles.stepHint}>Tell us a little about yourself so we can personalise your experience.</p>
                <div className={styles.grid}>
                  <label className={styles.field}>
                    <span>Full Name <em>*</em></span>
                    <input value={parent.name} onChange={(e) => pField('name', e.target.value)} placeholder="Enter full name" required />
                  </label>
                  <label className={styles.field}>
                    <span>Age <em>*</em></span>
                    <input type="number" min={18} max={100} value={parent.age} onChange={(e) => pField('age', e.target.value)} placeholder="Age" />
                  </label>
                  <label className={styles.field}>
                    <span>Phone Number <em>*</em></span>
                    <input value={parent.phone} onChange={(e) => pField('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  </label>
                  <label className={styles.field}>
                    <span>Relation to Child <em>*</em></span>
                    <select value={parent.relation} onChange={(e) => pField('relation', e.target.value)}>
                      <option value="">Select relation</option>
                      {['Mother', 'Father', 'Sister', 'Brother', 'Grandfather', 'Grandmother', 'Legal Guardian', 'Other'].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                  <label className={`${styles.field} ${styles.fieldWide}`}>
                    <span>Address</span>
                    <input value={parent.address} onChange={(e) => pField('address', e.target.value)} placeholder="Complete address" />
                  </label>
                  <label className={styles.field}>
                    <span>State</span>
                    <input value={parent.state} onChange={(e) => pField('state', e.target.value)} placeholder="e.g. Maharashtra" />
                  </label>
                </div>
                <div className={styles.nav}>
                  <div />
                  <Button
                    onClick={() => {
                      if (!parent.name || !parent.phone) {
                        toast('Full name and phone are required.', 'error');
                        return;
                      }
                      setStep(1);
                    }}
                    icon={ChevronRight}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── Step 1: Child Details ── */}
          {step === 1 && (
            <motion.div key="child" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className={styles.formCard}>
                <h2><Baby size={22} /> Child Details</h2>
                <p className={styles.stepHint}>Help us understand your child's background to provide the right activities.</p>
                <div className={styles.grid}>
                  <label className={styles.field}>
                    <span>Full Name <em>*</em></span>
                    <input value={student.name} onChange={(e) => sField('name', e.target.value)} placeholder="Child's full name" required />
                  </label>
                  <label className={styles.field}>
                    <span>Age <em>*</em></span>
                    <input type="number" min={1} max={25} value={student.age} onChange={(e) => sField('age', e.target.value)} placeholder="Age in years" />
                  </label>
                  <label className={styles.field}>
                    <span>School / Institute</span>
                    <input value={student.school} onChange={(e) => sField('school', e.target.value)} placeholder="School name (optional)" />
                  </label>
                  <label className={styles.field}>
                    <span>Grade / Class</span>
                    <input value={student.grade} onChange={(e) => sField('grade', e.target.value)} placeholder="e.g. LKG, Grade 3" />
                  </label>
                  <label className={styles.field}>
                    <span>Gender</span>
                    <select value={student.gender} onChange={(e) => sField('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Hobbies / Interests</span>
                    <input value={student.hobbies} onChange={(e) => sField('hobbies', e.target.value)} placeholder="Reading, sports, drawing..." />
                  </label>
                </div>
                <div className={styles.nav}>
                  <Button variant="ghost" onClick={() => setStep(0)} icon={ChevronLeft}>Back</Button>
                  <Button
                    onClick={() => {
                      if (!student.name || !student.age) {
                        toast("Child's name and age are required.", 'error');
                        return;
                      }
                      setStep(2);
                    }}
                    icon={ChevronRight}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── Step 2: Support Needs ── */}
          {step === 2 && (
            <motion.div key="disability" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Card className={styles.formCard}>
                <h2><Accessibility size={22} /> Support Needs</h2>
                <p className={styles.hint}>
                  Select all disability types that apply to your child. You may select multiple. We'll alert you if a combination needs clarification.
                </p>

                {/* Conflict alerts */}
                <AnimatePresence>
                  {conflicts.map((rule) => (
                    <motion.div
                      key={rule.ids.join('-')}
                      className={`${styles.conflictAlert} ${styles[`alert_${rule.severity}`]}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {rule.severity === 'warn'
                        ? <AlertTriangle size={16} className={styles.alertIcon} />
                        : <Info size={16} className={styles.alertIcon} />
                      }
                      <p>{rule.message}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Cards grouped by category */}
                {Object.entries(CATEGORY_META).map(([cat, meta]) => {
                  const cats = DISABILITY_TYPES.filter((d) => d.category === cat);
                  return (
                    <div key={cat} className={styles.categoryGroup}>
                      <div
                        className={styles.categoryLabel}
                        style={{ '--cat-color': meta.color }}
                      >
                        {meta.label}
                      </div>
                      <div className={styles.disabilityGrid}>
                        {cats.map((dt) => {
                          const IconComp = Icons[dt.icon] || Accessibility;
                          const selected = disabilityTypes.includes(dt.id);
                          return (
                            <motion.button
                              key={dt.id}
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              className={`${styles.disabilityCard} ${selected ? styles.disabilitySelected : ''}`}
                              style={{ '--dt-color': dt.color }}
                              onClick={() => toggleDisability(dt.id)}
                            >
                              <IconComp size={26} />
                              <span className={styles.dtLabel}>{dt.label}</span>
                              <span className={styles.dtDesc}>{dt.desc}</span>
                              {selected && <Check size={14} className={styles.disabilityCheck} />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {disabilityTypes.length > 0 && (
                  <div className={styles.selectedSummary}>
                    <span className={styles.selectedLabel}>Selected ({disabilityTypes.length}):</span>
                    {disabilityTypes.map((id) => {
                      const dt = DISABILITY_TYPES.find((d) => d.id === id);
                      return dt
                        ? <span key={id} className={styles.selectedTag} style={{ '--tag-color': dt.color }}>{dt.label}</span>
                        : null;
                    })}
                  </div>
                )}

                <div className={styles.nav}>
                  <Button variant="ghost" onClick={() => setStep(1)} icon={ChevronLeft}>Back</Button>
                  <Button onClick={handleSave} loading={saving} icon={Check}>Save Profile</Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
