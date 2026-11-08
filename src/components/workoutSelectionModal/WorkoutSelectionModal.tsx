import styles from './workout-selection-modal.module.css';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import Button from '@/components/button/Button';

interface workoutSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutSelectionModal({
  isOpen,
  onClose,
}: workoutSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <WorkoutModal title={'Выберите тренировку'} onClose={onClose}>
      <ul className={styles.workouts__list}>
        <li className={styles.workouts__item}>
          <div className={styles.workout__content}>
            <svg className={styles.workout__icon}>
              <use xlinkHref={`/img/icon/sprite.svg#icon-check`} />
            </svg>

            <div className={styles.workout__info}>
              <h3 className={styles.workout__title}>Утренняя практика</h3>
              <p className={styles.workout__description}>
                Йога на каждый день / 1 день
              </p>
            </div>
          </div>
        </li>
      </ul>
      <Button>Начать</Button>
    </WorkoutModal>
  );
}
