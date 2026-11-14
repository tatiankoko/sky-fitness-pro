import styles from './course-progress-content.module.css';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';
import React from 'react';
import ProgressItem from '@/components/progressItem/ProgressItem';
import Button from '@/components/button/Button';

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
  const maxProgress = course.workouts.length;

  const progress = !maxProgress
    ? 0
    : courseProgress?.courseCompleted
      ? maxProgress
      : (courseProgress?.workoutsProgress?.filter(
          (workout) => workout.workoutCompleted,
        ).length ?? 0);

  return (
    <div className={styles.user__content}>
      <ProgressItem title="Прогресс" progress={progress} max={maxProgress} />
      <Button disabled={isActionLoading} onClick={onWorkoutAction}>
        Начать тренировки
      </Button>
    </div>
  );
}
