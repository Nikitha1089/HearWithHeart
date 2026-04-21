import { motion } from 'framer-motion';
import styles from './Card.module.css';

export default function Card({ children, variant = 'default', hover = true, glass, className = '', delay = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`${styles.card} ${styles[variant]} ${glass ? styles.glass : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
