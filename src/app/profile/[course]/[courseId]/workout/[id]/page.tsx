'use client';

import styles from './workout.module.css';
import Button from '@/components/button/Button';
import WorkoutProgressModal from '@/components/workoutProgressModal/WorkoutProgressModal';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAppSelector } from '@/store/store';
import { CourseType, WorkoutType } from '@/sharedTypes/sharedTypes';
import {
  getWorkoutById,
  getWorkoutProgress,
} from '@/services/workout/workoutApi';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { baseSkeletonColor } from '@/utils/constants';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';
import ProgressItem from '@/components/progressItem/ProgressItem';
import { getCourseById } from '@/services/course/courseApi';

export default function Workout() {
  const params = useParams<{ id: string; course: string; courseId: string }>();
  const { allWorkouts } = useAppSelector((state) => state.workouts);
  const { accessToken } = useAppSelector((state) => state.user);

  const [showFillProgress, setShowFillProgress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType | null>(
    null,
  );
  const [workoutProgress, setWorkoutProgress] = useState<number[]>([]);
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);

    getCourseById(params.courseId)
      .then((course) => {
        setCurrentCourse(course);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setError(error.response.data);
          } else if (error.request) {
            setError('Произошла ошибка. Попробуйте позже');
          } else {
            setError('Неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const found = allWorkouts.length
      ? allWorkouts.find((workout) => workout._id === params.id)
      : null;

    if (found) {
      setCurrentWorkout(found);
      return;
    }

    setLoading(true);

    getWorkoutById(accessToken, params.id)
      .then((result) => {
        setCurrentWorkout(result);

        return getWorkoutProgress({
          access: accessToken,
          courseId: params.courseId,
          workoutId: result._id,
        });
      })
      .then((workoutProgress) => {
        console.log('workoutProgress ', workoutProgress);
        setWorkoutProgress(workoutProgress.progressData);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setError(error.response.data);
          } else if (error.request) {
            setError('Произошла ошибка. Попробуйте позже');
          } else {
            setError('Неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  const handleError = (error: any) => {
    toast.error('Ошибка плеера:', error);
  };

  return (
    <div className={styles.workout__container}>
      <h1 className={styles.workout__title}>
        {currentCourse?.nameRU || params.course}
      </h1>

      {loading ? (
        <Skeleton
          baseColor={baseSkeletonColor}
          width={1160}
          height={639}
          borderRadius={30}
        />
      ) : (
        <div className={styles.video__block}>
          {currentWorkout ? (
            <VideoPlayer
              videoUrl={currentWorkout.video}
              handleError={handleError}
            ></VideoPlayer>
          ) : null}
        </div>
      )}

      <div className={styles.training__block}>
        <h2 className={styles.training__title}>Упражнения тренировки</h2>
        <div className={styles.progress__block}>
          {loading ? (
            <>
              <Skeleton baseColor={baseSkeletonColor} width={320} height={36} />
              <Skeleton baseColor={baseSkeletonColor} width={320} height={36} />
              <Skeleton baseColor={baseSkeletonColor} width={320} height={36} />
            </>
          ) : (
            currentWorkout?.exercises.map((exercise, index) => (
              <ProgressItem
                key={exercise._id}
                title={exercise.name}
                progress={workoutProgress[index] || 0}
                max={exercise.quantity}
              />
            ))
          )}
        </div>

        <div className={styles.progress__button}>
          <Button disabled={loading} onClick={() => setShowFillProgress(true)}>
            {workoutProgress.length == 0 &&
            !workoutProgress.some((value) => value !== 0)
              ? 'Заполнить свой прогресс'
              : 'Обновить свой прогресс'}
          </Button>
        </div>
      </div>

      <WorkoutProgressModal
        courseId={currentCourse?._id || params.courseId}
        workout={currentWorkout}
        workoutProgress={workoutProgress}
        setWorkoutProgress={setWorkoutProgress}
        isOpen={showFillProgress}
        onClose={() => setShowFillProgress(!showFillProgress)}
      />
    </div>
  );
}
