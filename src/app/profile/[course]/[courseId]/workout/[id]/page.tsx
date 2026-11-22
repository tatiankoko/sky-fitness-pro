'use client';

import styles from './workout.module.css';
import Button from '@/components/button/Button';
import WorkoutProgressModal from '@/components/workoutProgressModal/WorkoutProgressModal';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CourseType, WorkoutType } from '@/sharedTypes/sharedTypes';
import {
  getWorkoutById,
  getWorkoutProgress,
  resetWorkoutProgress,
} from '@/services/workout/workoutApi';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { baseSkeletonColor } from '@/utils/constants';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';
import ProgressItem from '@/components/progressItem/ProgressItem';
import { getCourseById } from '@/services/course/courseApi';
import { useRedirectMain } from '@/hooks/useRedirectMain';
import { isInvalidToken } from '@/utils/helper';
import { setLogout } from '@/store/features/authSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export default function Workout() {
  const params = useParams<{ id: string; course: string; courseId: string }>();
  const dispatch = useAppDispatch();
  const { allWorkouts } = useAppSelector((state) => state.workouts);
  const { myCourses } = useAppSelector((state) => state.courses);
  const { accessToken } = useAppSelector((state) => state.user);

  const cachedCourse = myCourses.find(
    (course) => course._id === params.courseId,
  );
  const cachedWorkout = allWorkouts
    .find((courseWorkout) => courseWorkout.courseId === params.courseId)
    ?.workouts.find((workout) => workout._id === params.id);

  const [showFillProgress, setShowFillProgress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedWorkout, setFetchedWorkout] = useState<WorkoutType | null>(
    cachedWorkout ?? null,
  );
  const [workoutProgress, setWorkoutProgress] = useState<number[]>([]);
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [progressRefresh, setProgressRefresh] = useState<number>(0);
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(
    cachedCourse ?? null,
  );
  const loading = !error && (!currentCourse || !fetchedWorkout);

  useRedirectMain();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!accessToken || cachedCourse) return;

    getCourseById(params.courseId)
      .then((course) => {
        setCurrentCourse(course);
      })
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          setError(getApiErrorMessage(error));
        }
      });
  }, [accessToken, cachedCourse, params.courseId]);

  useEffect(() => {
    if (!accessToken || cachedWorkout) return;

    getWorkoutById(accessToken, params.id)
      .then((result) => {
        setFetchedWorkout(result);
      })
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          setError(getApiErrorMessage(error));
        }
      });
  }, [accessToken, allWorkouts, cachedWorkout, params.id]);

  useEffect(() => {
    if (!accessToken || !fetchedWorkout) return;

    getWorkoutProgress({
      access: accessToken,
      courseId: params.courseId,
      workoutId: params.id,
    })
      .then((progress) => {
        setWorkoutProgress(progress.progressData ?? []);
        setWorkoutCompleted(progress.workoutCompleted ?? false);
      })
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          setError(getApiErrorMessage(error));
        }
      });
  }, [accessToken, fetchedWorkout, params.courseId, params.id, progressRefresh]);

  const progressButtonLabel = workoutCompleted
    ? 'Начать заново'
    : workoutProgress.length === 0
      ? 'Заполнить свой прогресс'
      : 'Обновить свой прогресс';

  const onResetProgress = () => {
    if (!accessToken || !fetchedWorkout) return;

    setResetting(true);

    resetWorkoutProgress(accessToken, params.courseId, params.id)
      .then(() => {
        setProgressRefresh((value) => value + 1);
      })
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          setError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        setResetting(false);
      });
  };

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
      ) : fetchedWorkout ? (
        <div className={styles.video__block}>
          <VideoPlayer
            videoUrl={fetchedWorkout.video}
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
            fetchedWorkout?.exercises.map((exercise, index) => (
              <ProgressItem
                key={exercise._id}
                title={exercise.name}
                progress={workoutProgress?.[index] ?? 0}
                max={exercise.quantity}
              />
            ))
          )}
        </div>

        <div className={styles.progress__button}>
          <Button
            disabled={loading || resetting || !workoutProgress || !fetchedWorkout}
            onClick={
              workoutCompleted
                ? onResetProgress
                : () => setShowFillProgress(true)
            }
          >
            {progressButtonLabel}
          </Button>
        </div>
      </div>

      {showFillProgress ? (
        <WorkoutProgressModal
          courseId={currentCourse?._id || params.courseId}
          workout={fetchedWorkout}
          workoutProgress={workoutProgress}
          setWorkoutProgress={setWorkoutProgress}
          isOpen={showFillProgress}
          onClose={() => setShowFillProgress(false)}
        />
      ) : null}
    </div>
  );
}
