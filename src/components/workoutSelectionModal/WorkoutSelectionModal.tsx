'use client';

import styles from './workout-selection-modal.module.css';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import Button from '@/components/button/Button';
import { useAppSelector } from '@/store/store';
import { CourseType } from '@/sharedTypes/sharedTypes';
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useFetchWorkouts } from '@/hooks/useFetchWorkouts';
import { toast } from 'react-toastify';

interface workoutSelectionModalProps {
  isOpen: boolean;
  course: CourseType | null;
  onClose: () => void;
}

const getName = (name: string): string => name.split(' / ')[0];

const getDescription = (name: string): string => {
  const names = name.split(' / ');

  if (names.length <= 2) {
    const commaNames = name.split('. ');

    if (commaNames.length > 2) return `${commaNames[1]} / ${commaNames[2]}`;
    if (commaNames.length > 1) return commaNames[1];
    return name;
  }

  return `${names[1]} / ${names[2]}`;
};

export default function WorkoutSelectionModal({
  isOpen,
  course,
  onClose,
}: workoutSelectionModalProps) {
  const { allWorkouts } = useAppSelector((state) => state.workouts);
  const { myCoursesProgress } = useAppSelector((state) => state.courses);
  const { isLoading, errorMsg } = useFetchWorkouts(
    course?._id,
    isOpen && Boolean(course),
  );
  const [selection, setSelection] = useState<{
    courseId: string;
    workoutId: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg]);

  const courseProgress = myCoursesProgress.find(
    (progress) => progress.courseId === course?._id,
  );

  const courseWorkouts = useMemo(
    () =>
      allWorkouts.find((item) => item.courseId === course?._id)?.workouts ?? [],
    [allWorkouts, course?._id],
  );

  const completedWorkoutIds = useMemo(
    () =>
      new Set(
        courseProgress?.courseCompleted
          ? courseWorkouts.map((workout) => workout._id)
          : (courseProgress?.workoutsProgress
              ?.filter((item) => item.workoutCompleted)
              .map((item) => item.workoutId) ?? []),
      ),
    [courseProgress, courseWorkouts],
  );

  const selectedWorkoutId =
    selection?.courseId === course?._id ? selection?.workoutId : null;

  if (!isOpen || !course) return null;

  const onStartWorkoutClick = () => {
    if (!selectedWorkoutId) return;

    router.push(
      `/profile/${course.nameEN}/${course._id}/workout/${selectedWorkoutId}`,
    );
  };

  return (
    <WorkoutModal title={'Выберите тренировку'} onClose={onClose}>
      <ul className={styles.workouts__list}>
        {isLoading && courseWorkouts.length === 0 ? (
          <li>Загрузка тренировок...</li>
        ) : courseWorkouts.length === 0 ? (
          <li>Тренировки не найдены</li>
        ) : (
          courseWorkouts.map((workout) => (
            <li
              className={classNames(styles.workouts__item, {
                [styles.selected]: selectedWorkoutId === workout._id,
              })}
              key={workout._id}
              onClick={() =>
                setSelection({ courseId: course._id, workoutId: workout._id })
              }
            >
              <div className={styles.workout__content}>
                <svg className={styles.workout__icon}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#icon-${
                      completedWorkoutIds.has(workout._id)
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
          ))
        )}
      </ul>

      <Button
        disabled={selectedWorkoutId === null || isLoading}
        onClick={onStartWorkoutClick}
      >
        Начать
      </Button>
    </WorkoutModal>
  );
}
