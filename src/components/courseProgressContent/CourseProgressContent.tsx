import styles from './course-progress-content.module.css';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { useFetchCourseProgress } from '@/hooks/useFetchCourseProgress';
import { useFetchWorkouts } from '@/hooks/useFetchWorkouts';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import ProgressItem from '@/components/progressItem/ProgressItem';
import Button from '@/components/button/Button';

export default function CourseProgressContent({
  course,
  isActionLoading,
  onWorkoutAction,
}: {
  course: CourseType;
  isActionLoading: boolean;
  onWorkoutAction?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}) {
  const {
    isLoading: isCourseProgressLoading,
    errorMsg: courseProgressError,
    courseProgress,
  } = useFetchCourseProgress(course._id);

  const {
    isLoading: areWorkoutsLoading,
    errorMsg: workoutsError,
    workouts,
  } = useFetchWorkouts(course._id);

  const isLoading =
    isActionLoading || isCourseProgressLoading || areWorkoutsLoading;

  useEffect(() => {
    if (courseProgressError) toast.error(courseProgressError);
    if (workoutsError) toast.error(workoutsError);
  }, [courseProgressError, workoutsError]);

  const progress = !workouts.length
    ? 0
    : courseProgress?.courseCompleted
      ? workouts.length
      : (courseProgress?.workoutsProgress?.filter(
          (workout) => workout.workoutCompleted,
        ).length ?? 0);

  return (
    <div className={styles.user__content}>
      <ProgressItem
        title="Прогресс"
        progress={progress}
        max={workouts.length}
      />
      <Button disabled={isLoading} onClick={onWorkoutAction}>
        Начать тренировки
      </Button>
    </div>
  );
}
