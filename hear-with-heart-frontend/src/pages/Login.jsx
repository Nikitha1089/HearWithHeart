import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import styles from './Auth.module.css';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ identifier, password });
      toast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={styles.wrapper}>
        <div className={styles.glow} />
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.header}>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your child's journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="login-id">Username or Email</label>
              <div className={styles.inputWrap}>
                <Mail size={18} />
                <input
                  id="login-id"
                  type="text"
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="login-pw">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} />
                <input
                  id="login-pw"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <p className={styles.switch}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
