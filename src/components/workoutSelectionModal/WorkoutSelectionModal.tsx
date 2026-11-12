'use client';

import styles from './workout-selection-modal.module.css';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import Button from '@/components/button/Button';
import { useAppSelector } from '@/store/store';
import { CourseType, WorkoutType } from '@/sharedTypes/sharedTypes';
import React, { useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

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
  const { allWorkouts } = useAppSelector((state) => state.workouts);
  const { myCoursesProgress } = useAppSelector((state) => state.courses);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType | null>(
    null,
  );
  const router = useRouter();

  const courseProgress = myCoursesProgress.find(
    (progress) => progress.courseId === course?._id,
  );

  const courseWorkouts = allWorkouts?.find(
    (item) => item.courseId === course?._id,
  )?.workouts;

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

  const onStartWorkoutClick = () => {
    if (!selectedWorkout) {
      return;
    }

    router.push(
      `/profile/${course?.nameEN}/${course?._id}/workout/${selectedWorkout?._id}`,
    );
  };

  return (
    <WorkoutModal title={'Выберите тренировку'} onClose={onClose}>
      <ul className={styles.workouts__list}>
        {courseWorkouts?.map((workout) => {
          return (
            <li
              className={classNames(styles.workouts__item, {
                [styles.selected]: selectedWorkout?._id === workout._id,
              })}
              key={workout._id}
              onClick={() => setSelectedWorkout(workout)}
            >
              <div className={styles.workout__content}>
                <svg className={styles.workout__icon}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#icon-${
                      courseProgress?.courseCompleted ||
                      courseProgress?.workoutsProgress?.some(
                        (item) =>
                          item.workoutId === workout._id &&
                          item.workoutCompleted,
                      )
                        ? 'check'
                        : 'no-check'
                    }`}
                  />
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
        })}
      </ul>

      <Button disabled={selectedWorkout === null} onClick={onStartWorkoutClick}>
        Начать
      </Button>
    </WorkoutModal>
  );
}
