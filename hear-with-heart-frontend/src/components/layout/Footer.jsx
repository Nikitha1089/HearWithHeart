import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import LogoIcon from '../ui/LogoIcon';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerBase}>
      {/* ── CTA Top Section ── */}
      <div className={styles.footerTopArea}>
        <div className={`container ${styles.ctaContainer}`}>
          <div className={styles.ctaContent}>
            <h2>Ready to transform your child's journey?</h2>
            <p>Join thousands of parents dedicated to early intervention at home.</p>
          </div>
          <Link to="/register" className={styles.ctaBtn}>
            Start Free Today <ArrowRight size={18} className={styles.ctaIcon} />
          </Link>
        </div>
      </div>
      
      {/* ── Main Footer Mesh ── */}
      <div className={`container ${styles.footerMain}`}>
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logoLink}>
            <LogoIcon size={46} />
            <span className={styles.brandName}>HearWithHeart</span>
          </Link>
          <p className={styles.brandDesc}>
            Bridging the gap in early intervention for children with hearing, speech, and developmental needs. Evidence-based daily activities designed for home.
          </p>
          <div className={styles.contactChips}>
            <a href="mailto:hello@hearwithheart.in" aria-label="Email us">
              <Mail size={16} /> hello@hearwithheart.in
            </a>
            <a href="tel:1800110031" aria-label="Call helpline">
              <Phone size={16} /> 1800-11-0031
            </a>
          </div>
        </div>

        <div className={styles.linksCol}>
          <h4 className={styles.colHeader}>Platform</h4>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assessment">Assessment</Link>
          <Link to="/milestones">Milestones</Link>
          <Link to="/resources">Expert Resources</Link>
        </div>

        <div className={styles.linksCol}>
          <h4 className={styles.colHeader}>Govt Schemes</h4>
          <a href="https://www.disabilityaffairs.gov.in" target="_blank" rel="noreferrer">ADIP Scheme</a>
          <a href="https://www.swavlambancard.gov.in" target="_blank" rel="noreferrer">UDID Card</a>
          <a href="https://thenationaltrust.gov.in" target="_blank" rel="noreferrer">Niramaya ID</a>
          <a href="https://rbsk.gov.in" target="_blank" rel="noreferrer">RBSK Program</a>
        </div>

        <div className={styles.linksCol}>
          <h4 className={styles.colHeader}>Organisation</h4>
          <Link to="/about">About Us</Link>
          <Link to="/mission">Our Mission</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>

      {/* ── Bottom Strip ── */}
      <div className={styles.footerBottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} HearWithHeart. Designed with <Heart size={14} className={styles.heartPulse} fill="currentColor" /> for global accessibility.
          </p>
          <div className={styles.socialMocks}>
             <a href="#instagram">Instagram</a>
             <a href="#twitter">Twitter</a>
             <a href="#linkedin">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
