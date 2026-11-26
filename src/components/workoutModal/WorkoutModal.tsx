import styles from './workout-modal.module.css';
import Modal from '@/components/modal/Modal';
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
    <Modal
      overlayClassName={styles.overlay}
      dialogClassName={styles.dialog}
      onClose={onClose}
      ariaLabel={title}
    >
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.content}>{children}</div>
    </Modal>
  );
}
