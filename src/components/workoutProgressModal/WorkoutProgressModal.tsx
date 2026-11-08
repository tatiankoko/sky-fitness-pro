import styles from './workout-progress-modal.module.css';
import Button from '@/components/button/Button';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';

interface workoutProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutProgressModal({
  isOpen,
  onClose,
}: workoutProgressModalProps) {
  if (!isOpen) return null;

  return (
    <WorkoutModal title={'Мой прогресс'} onClose={onClose}>
      <div className={styles.progress__list}></div>

      <Button>Сохранить</Button>
    </WorkoutModal>
  );
}
