import styles from './workout-success-modal.module.css';
import Modal from '@/components/modal/Modal';
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
    <Modal
      overlayClassName={styles.overlay}
      dialogClassName={styles.dialog}
      onClose={onClose}
    >
      <h1 className={styles.success__title}>Ваш прогресс засчитан!</h1>

      <svg className={styles.success__icon}>
        <use xlinkHref={'/img/icon/sprite.svg#icon-check'} />
      </svg>
    </Modal>
  );
}
