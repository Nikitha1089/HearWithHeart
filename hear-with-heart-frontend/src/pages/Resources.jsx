import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lightbulb, ExternalLink, Landmark, Search, Star, Globe, RefreshCw, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import { GOVT_SCHEMES, EXPERT_TIPS } from '../utils/helpers';
import expertTipPoster from '../assets/expert tip.png';
import styles from './Resources.module.css';

const EXTERNAL_LINKS = [
  { name: 'WHO - Childhood Disability', url: 'https://www.who.int/health-topics/disability', tag: 'International' },
  { name: 'CDC Milestone Tracker', url: 'https://www.cdc.gov/ncbddd/actearly/milestones/', tag: 'Tool' },
  { name: 'ASHA - Speech-Language Info', url: 'https://www.asha.org', tag: 'Speech' },
  { name: 'AYJNISHD, Mumbai', url: 'https://ayjnishd.nic.in', tag: 'Indian Institute' },
  { name: 'Indian Sign Language Research', url: 'https://islrtc.nic.in', tag: 'Sign Language' },
  { name: 'National Trust for Disability', url: 'https://thenationaltrust.gov.in', tag: 'Government' }
];

export default function Resources() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tipIdx, setTipIdx] = useState(0);
  const [schemeSearch, setSchemeSearch] = useState('');
  const [posterOpen, setPosterOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const tip = EXPERT_TIPS[tipIdx];
  const filteredSchemes = GOVT_SCHEMES.filter(
    (s) => s.name.toLowerCase().includes(schemeSearch.toLowerCase()) || s.desc.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  return (
    <PageTransition>
      <div className={`${styles.page} container`}>
        <div className={styles.header}>
          <h1><BookOpen size={28} /> Resources & Guides</h1>
          <p>Expert tips, government support schemes, and valuable resources — all in one place.</p>
        </div>

        {/* Tip of the Day */}
        <Card variant="gradient" className={styles.tipCard} delay={0}>
          <div className={styles.tipHeader}>
            <Lightbulb size={22} className={styles.tipIcon} />
            <h2>Tip of the Day</h2>
            <Button variant="ghost" size="sm" onClick={() => setTipIdx((i) => (i + 1) % EXPERT_TIPS.length)} icon={RefreshCw}>
              Next Tip
            </Button>
          </div>
          <motion.div key={tipIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className={styles.tipTitle}>{tip.title}</h3>
            <p className={styles.tipBody}>{tip.body}</p>
          </motion.div>
        </Card>

        {/* Expert Tip Poster */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><ImageIcon size={22} /> Expert Guidance</h2>
          <motion.div
            className={styles.posterCard}
            onClick={() => setPosterOpen(true)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.posterIconWrap}>
              <ImageIcon size={24} />
            </div>
            <h3>View Expert Tips Poster</h3>
            <p>Professional guidance for supporting your child's development journey.</p>
            <span className={styles.posterLink}>Open Poster <ExternalLink size={14} /></span>
          </motion.div>
        </section>

        {/* Poster Modal */}
        <AnimatePresence>
          {posterOpen && (
            <motion.div
              className={styles.posterModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPosterOpen(false)}
            >
              <motion.div
                className={styles.posterModalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.posterClose}
                  onClick={() => setPosterOpen(false)}
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
                <img src={expertTipPoster} alt="Expert Tip Poster" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Government Schemes */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2><Landmark size={22} /> Government Schemes & Support</h2>
            <div className={styles.searchWrap}>
              <Search size={16} />
              <input
                placeholder="Search schemes..."
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.schemesGrid}>
            {filteredSchemes.map((s, i) => (
              <Card key={s.name} delay={i * 0.05} className={styles.schemeCard}>
                <Landmark size={20} className={styles.schemeIcon} />
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.schemeLink}>
                  Visit Website <ExternalLink size={14} />
                </a>
              </Card>
            ))}
            {filteredSchemes.length === 0 && (
              <p className={styles.empty}>No schemes match your search.</p>
            )}
          </div>
        </section>

        {/* External Links */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><Globe size={22} /> Valuable External Resources</h2>
          <div className={styles.linksGrid}>
            {EXTERNAL_LINKS.map((link, i) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkItem}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={styles.linkInner}
                >
                  <div className={styles.linkInfo}>
                    <h4>{link.name}</h4>
                    <Badge variant="default" size="sm">{link.tag}</Badge>
                  </div>
                  <ExternalLink size={16} className={styles.linkArrow} />
                </motion.div>
              </a>
            ))}
          </div>
        </section>

        {/* Community */}
        <Card variant="primary" className={styles.communityCard} delay={0.1}>
          <h2>Join the Community</h2>
          <p>Connect with other parents, share experiences, and find support.</p>
          <div className={styles.communityActions}>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
              <Button variant="accent" icon={Star}>Join WhatsApp Group</Button>
            </a>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
