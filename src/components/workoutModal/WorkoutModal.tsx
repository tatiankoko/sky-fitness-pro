import styles from './workout-modal.module.css';
import { ReactNode } from 'react';

interface workoutModalProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
}

export default function WorkoutModal({
  children,
  title,
  onClose,
}: workoutModalProps) {
  return (
    <form className={styles.overlay} onClick={onClose}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.content}>{children}</div>
      </section>
    </form>
  );
}
