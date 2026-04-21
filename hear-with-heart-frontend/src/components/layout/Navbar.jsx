import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, LogOut, Menu, X,
  LayoutDashboard, User, ClipboardList, Trophy, BookOpen,
  ChevronDown, Sparkles, Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import LogoIcon from '../ui/LogoIcon';
import ConfirmModal from '../ui/ConfirmModal';
import styles from './Navbar.module.css';

const APP_LINKS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/assessment', label: 'Assessment', icon: ClipboardList },
  { to: '/milestones', label: 'Milestones', icon: Trophy },
  { to: '/resources',  label: 'Resources',  icon: BookOpen },
];

const LANDING_SECTIONS = [
  { href: '#features',  label: 'Features' },
  { href: '#how',       label: 'How It Works' },
  { href: '#research',  label: 'Research' },
];

/** Pages that should show a minimal "auth-only" navbar */
const AUTH_ONLY_PATHS = ['/register', '/login'];

/** Deterministic gradient from username so each user gets a stable avatar colour. */
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
  'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
];

function hashString(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getInitials(name = '') {
  const parts = name.trim().split(/[\s_.-]+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen]           = useState(false);
  const [scrolled, setScrolled]               = useState(false);
  const [scrollProgress, setScrollProgress]   = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen]       = useState(false);
  const [hoveredLink, setHoveredLink]         = useState(null);

  const userMenuRef = useRef(null);

  /* Close mobile/user menus on route change */
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  /* Detect scroll for navbar shadow + progress */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close user dropdown on outside click / escape */
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const handleKey = (e) => { if (e.key === 'Escape') setUserMenuOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [userMenuOpen]);

  /* Lock body scroll when mobile drawer open */
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  const isAuthOnly = AUTH_ONLY_PATHS.includes(location.pathname);
  const isLanding  = location.pathname === '/';

  const handleLogoutConfirmed = async () => {
    setShowLogoutModal(false);
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const scrollToSection = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const avatarGradient = AVATAR_GRADIENTS[hashString(user?.username || user?.email || '') % AVATAR_GRADIENTS.length];
  const initials = getInitials(user?.username || user?.email || '');

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`${styles.inner} container`}>

          {/* ── Logo ── */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className={styles.logo}
            aria-label="HearWithHeart home"
          >
            <LogoIcon size={36} className={styles.logoIcon} />
            <span className={styles.logoText}>
              Hear<span className={styles.logoHeart}>With</span>Heart
            </span>
          </Link>

          {/* ─────── AUTH-ONLY NAVBAR (register / login) ─────── */}
          {isAuthOnly && (
            <div className={styles.authOnlyRight}>
              <button onClick={toggle} className={styles.themeBtn} aria-label="Toggle theme">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          )}

          {/* ─────── LANDING NAVBAR (unauthenticated, on /  ) ─────── */}
          {!isAuthOnly && !isAuthenticated && isLanding && (
            <>
              <nav
                className={`${styles.landingNav} ${mobileOpen ? styles.open : ''}`}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {LANDING_SECTIONS.map((s) => (
                  <button
                    key={s.href}
                    className={`${styles.landingLink} ${hoveredLink === s.href ? styles.landingLinkHovered : ''}`}
                    onClick={() => scrollToSection(s.href)}
                    onMouseEnter={() => setHoveredLink(s.href)}
                    onFocus={() => setHoveredLink(s.href)}
                  >
                    {hoveredLink === s.href && (
                      <motion.span
                        layoutId="landing-hover"
                        className={styles.landingHoverPill}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={styles.landingLinkText}>{s.label}</span>
                  </button>
                ))}
              </nav>

              <div className={styles.right}>
                <Link to="/login" className={styles.signInBtn}>Sign In</Link>
                <Link to="/register" className={styles.signUpBtn}>
                  <Sparkles size={15} className={styles.signUpIcon} />
                  <span>Get Started</span>
                </Link>
                <button onClick={toggle} className={styles.themeBtn} aria-label="Toggle theme">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  className={styles.burger}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </>
          )}

          {/* ─────── UNAUTHENTICATED but NOT on landing ─────── */}
          {!isAuthOnly && !isAuthenticated && !isLanding && (
            <div className={styles.right}>
              <Link to="/login" className={styles.signInBtn}>Sign In</Link>
              <Link to="/register" className={styles.signUpBtn}>
                <Sparkles size={15} className={styles.signUpIcon} />
                <span>Get Started</span>
              </Link>
              <button onClick={toggle} className={styles.themeBtn} aria-label="Toggle theme">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          )}

          {/* ─────── APP NAVBAR (authenticated) ─────── */}
          {!isAuthOnly && isAuthenticated && (
            <>
              <nav className={`${styles.nav} ${mobileOpen ? styles.open : ''}`}>
                {APP_LINKS.map((link) => {
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`${styles.link} ${active ? styles.active : ''}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className={styles.navPill}
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className={styles.linkInner}>
                        <link.icon size={16} strokeWidth={2.2} />
                        <span>{link.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className={styles.right}>
                <button onClick={toggle} className={styles.themeBtn} aria-label="Toggle theme">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* User Menu */}
                <div className={styles.userMenuWrap} ref={userMenuRef}>
                  <button
                    className={`${styles.userTrigger} ${userMenuOpen ? styles.userTriggerOpen : ''}`}
                    onClick={() => setUserMenuOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="Account menu"
                  >
                    <span className={styles.avatar} style={{ background: avatarGradient }}>
                      <span className={styles.avatarInitials}>{initials}</span>
                    </span>
                    <span className={styles.userMeta}>
                      <span className={styles.userName}>{user?.username || 'Account'}</span>
                      <span className={styles.userRole}>Parent account</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`${styles.chev} ${userMenuOpen ? styles.chevOpen : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className={styles.userDropdown}
                        role="menu"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className={styles.userDropdownHeader}>
                          <span className={styles.avatarLg} style={{ background: avatarGradient }}>
                            <span className={styles.avatarInitialsLg}>{initials}</span>
                          </span>
                          <div className={styles.userHeaderMeta}>
                            <div className={styles.userHeaderName}>{user?.username || 'Account'}</div>
                            {user?.email && (
                              <div className={styles.userHeaderEmail}>
                                <Mail size={12} />
                                <span>{user.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={styles.userDropdownList}>
                          <Link
                            to="/profile"
                            className={styles.userDropdownItem}
                            onClick={() => setUserMenuOpen(false)}
                            role="menuitem"
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            className={styles.userDropdownItem}
                            onClick={() => setUserMenuOpen(false)}
                            role="menuitem"
                          >
                            <LayoutDashboard size={16} />
                            <span>Dashboard</span>
                          </Link>
                          <button
                            type="button"
                            className={styles.userDropdownItem}
                            onClick={toggle}
                            role="menuitem"
                          >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                            <span className={styles.themePillIndicator} aria-hidden>
                              <span className={`${styles.themeDot} ${isDark ? styles.themeDotRight : ''}`} />
                            </span>
                          </button>
                        </div>

                        <div className={styles.userDropdownDivider} />

                        <button
                          type="button"
                          className={`${styles.userDropdownItem} ${styles.userDropdownDanger}`}
                          onClick={() => {
                            setUserMenuOpen(false);
                            setShowLogoutModal(true);
                          }}
                          role="menuitem"
                        >
                          <LogOut size={16} />
                          <span>Sign out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className={styles.burger}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Scroll progress bar */}
        <div className={styles.progressTrack} aria-hidden>
          <div className={styles.progressFill} style={{ width: `${scrollProgress}%` }} />
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirmed}
        title="Sign out?"
        message="You'll need to sign in again to access your child's progress and activities."
        confirmLabel="Yes, Sign Out"
        confirmVariant="danger"
        icon={LogOut}
      />
    </>
  );
}
