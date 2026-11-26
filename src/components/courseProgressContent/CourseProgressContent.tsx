'use client';

import styles from './course-progress-content.module.css';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';
import React, { useState } from 'react';
import ProgressItem from '@/components/progressItem/ProgressItem';
import Button from '@/components/button/Button';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { resetCourseProgress } from '@/services/course/courseApi';
import { invalidateMyCourses } from '@/store/features/courseSlice';
import { isInvalidToken } from '@/utils/helper';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { toast } from 'react-toastify';

export default function CourseProgressContent({
  course,
  courseProgress,
  isActionLoading,
  onWorkoutAction,
}: {
  course: CourseType;
  courseProgress?: CourseProgressType;
  isActionLoading: boolean;
  onWorkoutAction?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const [resetting, setResetting] = useState<boolean>(false);

  const maxProgress = course.workouts.length;
  const courseCompleted = courseProgress?.courseCompleted ?? false;

  const progress = !maxProgress
    ? 0
    : courseCompleted
      ? maxProgress
      : (courseProgress?.workoutsProgress?.filter(
          (workout) => workout.workoutCompleted,
        ).length ?? 0);

  const buttonLabel = courseCompleted
    ? 'Начать заново'
    : progress > 0
      ? 'Продолжить'
      : 'Начать тренировки';

  const onResetProgress = () => {
    if (resetting || !accessToken) return;

    setResetting(true);

    resetCourseProgress(accessToken, course._id)
      .then(() => {
        dispatch(invalidateMyCourses());
      })
      .catch((error) => {
        if (!isInvalidToken(error)) {
          toast.error(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        setResetting(false);
      });
  };

  return (
    <div className={styles.user__content}>
      <ProgressItem title="Прогресс" progress={progress} max={maxProgress} />
      <Button
        disabled={isActionLoading || resetting}
        onClick={courseCompleted ? onResetProgress : onWorkoutAction}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
