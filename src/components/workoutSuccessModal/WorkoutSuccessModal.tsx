import styles from './workout-success-modal.module.css';
import React from 'react';

interface workoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutSuccessModal({
  isOpen,
  onClose,
}: workoutSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h1 className={styles.success__title}>Ваш прогресс засчитан!</h1>

        <svg className={styles.success__icon}>
          <use xlinkHref={'/img/icon/sprite.svg#icon-check'} />
        </svg>
      </div>
    </div>
  );
}
