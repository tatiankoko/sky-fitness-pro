'use client';

import styles from './workout-selection-modal.module.css';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import Button from '@/components/button/Button';
import { useAppSelector } from '@/store/store';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { useFetchWorkouts } from '@/hooks/useFetchWorkouts';
import Skeleton from 'react-loading-skeleton';
import { baseSkeletonColor } from '@/utils/constants';

interface workoutSelectionModalProps {
  isOpen: boolean;
  course: CourseType | null;
  onClose: () => void;
}

export default function WorkoutSelectionModal({
  isOpen,
  course,
  onClose,
}: workoutSelectionModalProps) {
  const { isLoading } = useFetchWorkouts(course?._id, isOpen);
  const { allWorkouts } = useAppSelector((state) => state.workouts);

  if (!isOpen || !course) return null;

  const getName = (name: string): string => {
    const names = name.split(' / ');
    return names.length > 0 ? names[0] : name;
  };

  const getDescription = (name: string): string => {
    const names = name.split(' / ');

    if (names.length <= 2) {
      const commaNames = name.split('. ');

      if (commaNames.length > 0) {
        return commaNames.length > 2
          ? `${commaNames[1]} / ${commaNames[2]}`
          : commaNames.length > 1
            ? commaNames[1]
            : name;
      }
    }

    return names.length > 2
      ? `${names[1]} / ${names[2]}`
      : names.length > 1
        ? names[1]
        : name;
  };

  return (
    <WorkoutModal title={'Выберите тренировку'} onClose={onClose}>
      <ul className={styles.workouts__list}>
        {isLoading ? (
          <>
            <li className={styles.workouts__item}>
              <div className={styles.workout__content}>
                <Skeleton
                  baseColor={baseSkeletonColor}
                  width={354}
                  height={64}
                />
              </div>
            </li>
            <li className={styles.workouts__item}>
              <div className={styles.workout__content}>
                <Skeleton
                  baseColor={baseSkeletonColor}
                  width={354}
                  height={64}
                />
              </div>
            </li>
          </>
        ) : (
          allWorkouts.map((workout) => {
            return (
              <li className={styles.workouts__item} key={workout._id}>
                <div className={styles.workout__content}>
                  <svg className={styles.workout__icon}>
                    <use xlinkHref={`/img/icon/sprite.svg#icon-check`} />
                  </svg>

                  <div className={styles.workout__info}>
                    <h3 className={styles.workout__title}>
                      {getName(workout.name)}
                    </h3>
                    <p className={styles.workout__description}>
                      {getDescription(workout.name)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <Button>Начать</Button>
    </WorkoutModal>
  );
}
