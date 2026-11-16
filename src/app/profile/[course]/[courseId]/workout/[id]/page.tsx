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
import { useRedirectMain } from '@/hooks/useRedirectMain';

export default function Workout() {
  const params = useParams<{ id: string; course: string; courseId: string }>();
  const { allWorkouts } = useAppSelector((state) => state.workouts);
  const { accessToken } = useAppSelector((state) => state.user);
  const cachedWorkout = allWorkouts
    .find((courseWorkout) => courseWorkout.courseId === params.courseId)
    ?.workouts.find((workout) => workout._id === params.id);

  const [showFillProgress, setShowFillProgress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedWorkout, setFetchedWorkout] = useState<{
    id: string;
    workout: WorkoutType;
  } | null>(null);
  const [workoutProgress, setWorkoutProgress] = useState<number[]>([]);
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);
  const currentWorkout =
    cachedWorkout ??
    (fetchedWorkout?.id === params.id ? fetchedWorkout.workout : null);

  useRedirectMain();
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!accessToken) return;

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
  }, [accessToken, params.courseId]);

  useEffect(() => {
    if (!accessToken || cachedWorkout) return;

    getWorkoutById(accessToken, params.id)
      .then((result) => {
        setFetchedWorkout({ id: params.id, workout: result });
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
  }, [accessToken, allWorkouts, cachedWorkout, params.id]);

  useEffect(() => {
    if (!accessToken || !currentWorkout) return;

    getWorkoutProgress({
      access: accessToken,
      courseId: params.courseId,
      workoutId: currentWorkout._id,
    })
      .then((progress) => {
        setWorkoutProgress(progress.progressData);
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
  }, [accessToken, currentWorkout, params.courseId]);

  const handleError = (error: unknown) => {
    toast.error(error instanceof Error ? error.message : 'Ошибка плеера');
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
      ) : currentWorkout ? (
        <div className={styles.video__block}>
          <VideoPlayer
            videoUrl={currentWorkout.video}
            handleError={handleError}
          ></VideoPlayer>
        </div>
      ) : null}

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
                progress={/*workoutProgress[index] ?? */ 0} // todo fix it
                max={exercise.quantity}
              />
            ))
          )}
        </div>

        <div className={styles.progress__button}>
          <Button
            disabled={loading || !workoutProgress || !currentWorkout}
            onClick={() => setShowFillProgress(true)}
          >
            {workoutProgress?.length == 0 && // todo fix it
            !workoutProgress.some((value) => value !== 0)
              ? 'Заполнить свой прогресс'
              : 'Обновить свой прогресс'}
          </Button>
        </div>
      </div>

      {showFillProgress ? (
        <WorkoutProgressModal
          courseId={currentCourse?._id || params.courseId}
          workout={currentWorkout}
          workoutProgress={workoutProgress}
          setWorkoutProgress={setWorkoutProgress}
          isOpen={showFillProgress}
          onClose={() => setShowFillProgress(false)}
        />
      ) : null}
    </div>
  );
}
