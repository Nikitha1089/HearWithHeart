import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Heart, Ear, Brain, Accessibility,
  Users, BookOpen, ShieldCheck, Star, Sparkles,
  CheckCircle, PhoneCall, Award
} from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import heroImg from '../assets/hearwithheart-hero-sec.jpeg';
import styles from './Landing.module.css';

const stats = [
  { num: '63M+', label: 'Children affected in India',      icon: Users },
  { num: '80%',  label: 'Benefit from early intervention', icon: Star },
  { num: '7',    label: 'Daily guided activities',         icon: BookOpen },
  { num: '100%', label: 'Free & accessible',               icon: ShieldCheck },
];

const features = [
  {
    icon: Ear,
    title: 'Hearing & Speech Support',
    desc: 'Personalised activities for children with hearing or speech disabilities using everyday household items.',
    color: '#8b5cf6',
  },
  {
    icon: Brain,
    title: 'Cognitive Development',
    desc: 'Age-specific tasks to enhance memory, pattern recognition, and problem-solving skills.',
    color: '#3b82f6',
  },
  {
    icon: Accessibility,
    title: 'Motor Skill Building',
    desc: 'Fun physical activities designed to improve fine and gross motor skills progressively.',
    color: '#10b981',
  },
  {
    icon: Heart,
    title: 'Socio-Emotional Growth',
    desc: 'Guided exercises to help your child express emotions, build confidence, and interact socially.',
    color: '#f43f5e',
  },
];

const research = [
  { cite: 'Yoshinaga-Itano, 2020', fact: 'Children diagnosed before 6 months with early intervention develop language at age-appropriate levels.' },
  { cite: 'Roberts & Kaiser, 2015', fact: 'Parent-implemented language strategies significantly improve child speech outcomes.' },
  { cite: 'Meadow-Orlans et al., 2004', fact: 'Visual supports and gestures accelerate speech learning in deaf children.' },
  { cite: 'Moeller, 2000', fact: 'Consistent parental involvement builds communication confidence and reduces anxiety.' },
];

const trustLogos = [
  'NIMH India', 'National Trust', 'AYJNISHD', 'RBSK Program'
];

export default function Landing() {
  return (
    <PageTransition>

      {/* ========== HERO ========== */}
      <section className={styles.hero} id="home">
        {/* Left: Image */}
        <motion.div
          className={styles.heroImageCol}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.heroImageWrap}>
            <img src={heroImg} alt="Therapist guiding a child with building blocks" className={styles.heroImg} />
            {/* Floating badge */}
            <motion.div
              className={styles.floatBadge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Award size={18} className={styles.floatIcon} />
              <div>
                <span className={styles.floatTitle}>Evidence-Based</span>
                <span className={styles.floatSub}>Clinically Inspired Activities</span>
              </div>
            </motion.div>
            {/* Floating stat pill */}
            <motion.div
              className={`${styles.floatBadge} ${styles.floatBadge2}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <PhoneCall size={18} className={styles.floatIcon2} />
              <div>
                <span className={styles.floatTitle}>1800-11-0031</span>
                <span className={styles.floatSub}>Toll-Free Helpline</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Text */}
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.heroBadge}>
            <Sparkles size={13} /> Home-to-Heart Approach
          </span>

          <h1 className={styles.heroTitle}>
            Every Child Deserves a{' '}
            <span className={styles.heroAccent}>Voice</span>
          </h1>

          <p className={styles.heroSub}>
            An affordable, accessible platform helping parents guide their child's
            cognitive, motor & socio-emotional development at home — no expensive
            clinical tools needed.
          </p>

          <ul className={styles.heroBullets}>
            {[
              'Personalised weekly therapy activities',
              "Based on your child's assessment",
              'Using everyday household items',
            ].map((b) => (
              <li key={b}>
                <CheckCircle size={17} className={styles.bulletIcon} />
                {b}
              </li>
            ))}
          </ul>

          <div className={styles.heroCta}>
            <Link to="/register">
              <Button size="lg" icon={ArrowRight}>Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">Sign In</Button>
            </Link>
          </div>

          <p className={styles.heroNote}>
            Trusted by 500+ families across India. Completely free.
          </p>
        </motion.div>
      </section>

      {/* ========== STATS ========== */}
      <section className={styles.statsSection}>
        <div className={`${styles.statsGrid} container`}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <s.icon size={22} className={styles.statIcon} />
              <h3 className={styles.statNum}>{s.num}</h3>
              <p className={styles.statLabel}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className={styles.section} id="features">
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className={styles.sectionTag}>What We Offer</span>
            <h2>Supporting Every Dimension of Growth</h2>
            <p>Our platform personalises therapy activities based on your child's unique developmental needs.</p>
          </motion.div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <Card key={f.title} delay={i * 0.1} className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ '--fc': f.color }}>
                  <f.icon size={26} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className={`${styles.section} ${styles.howSection}`} id="how">
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className={styles.sectionTag}>Simple Process</span>
            <h2>How It Works</h2>
            <p>Three simple steps to start supporting your child's development today.</p>
          </motion.div>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', title: 'Create Profile', desc: "Sign up and tell us about your child — age, disability type, and developmental context." },
              { step: '02', title: 'Take Assessment', desc: "Complete a quick, age-specific assessment covering cognition, motor, and socio-emotional domains." },
              { step: '03', title: 'Start Activities', desc: "Receive personalised weekly tasks using everyday household items. Track progress and celebrate milestones." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className={styles.stepCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <span className={styles.stepNum}>{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RESEARCH ========== */}
      <section className={styles.section} id="research">
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className={styles.sectionTag}>Science-Backed</span>
            <h2>Backed by Research</h2>
            <p>Our approach integrates findings from leading developmental studies worldwide.</p>
          </motion.div>
          <div className={styles.researchGrid}>
            {research.map((r, i) => (
              <Card key={r.cite} delay={i * 0.08} className={styles.researchCard}>
                <p className={styles.researchFact}>"{r.fact}"</p>
                <cite className={styles.researchCite}>— {r.cite}</cite>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TRUST STRIP ========== */}
      <section className={styles.trustSection}>
        <div className="container">
          <p className={styles.trustLabel}>Aligned with India's leading disability bodies</p>
          <div className={styles.trustLogos}>
            {trustLogos.map((t) => (
              <span key={t} className={styles.trustLogo}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className={styles.ctaBadge}><Heart size={14} fill="currentColor" /> Join the Community</span>
            <h2>Start Your Child's Journey Today</h2>
            <p>Join hundreds of parents who are making a difference. It's completely free.</p>
            <Link to="/register">
              <Button size="lg" icon={ArrowRight}>Create Free Account</Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </PageTransition>
  );
}
