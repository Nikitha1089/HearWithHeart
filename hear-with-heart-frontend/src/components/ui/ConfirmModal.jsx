import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';
import styles from './ConfirmModal.module.css';

/**
 * A reusable confirmation modal with a backdrop.
 * Props:
 *   open      – boolean
 *   onConfirm – called when user clicks confirm button
 *   onCancel  – called when user cancels or clicks backdrop
 *   title     – string
 *   message   – string
 *   confirmLabel – string (default "Confirm")
 *   confirmVariant – button variant (default "danger")
 *   icon      – lucide icon component (optional)
 */
export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  icon: Icon = AlertTriangle,
  variant = 'danger',
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={onCancel}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className={`${styles.iconWrap} ${styles[variant]}`}>
              <Icon size={28} />
            </div>

            <h2 className={styles.title}>{title}</h2>
            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.actions}>
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant={confirmVariant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
