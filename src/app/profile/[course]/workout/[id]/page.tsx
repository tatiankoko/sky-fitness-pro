'use client';

import styles from './workout.module.css';
import Button from '@/components/button/Button';
import WorkoutProgressModal from '@/components/workoutProgressModal/WorkoutProgressModal';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAppSelector } from '@/store/store';
import { WorkoutType } from '@/sharedTypes/sharedTypes';
import { getWorkoutById } from '@/services/workout/workoutApi';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { baseSkeletonColor } from '@/utils/constants';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';

export default function Workout() {
  const params = useParams<{ id: string; course: string }>();
  const { allWorkouts } = useAppSelector((state) => state.workouts);
  const { accessToken } = useAppSelector((state) => state.user);
  const [showFillProgress, setShowFillProgress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutType | null>(
    null,
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!accessToken) return;

    if (allWorkouts.length) {
      setCurrentWorkout(
        allWorkouts.find((workout) => workout._id === params.id) || null,
      );
      return;
    }

    setLoading(true);

    getWorkoutById(accessToken, params.id)
      .then((result) => {
        setCurrentWorkout(result);
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

  return (
    <div className={styles.workout__container}>
      <h1 className={styles.workout__title}>{params.course}</h1>

      <div className={styles.video__block}>
        {currentWorkout ? (
          <VideoPlayer videoUrl={currentWorkout.video}></VideoPlayer>
        ) : null}
      </div>

      <div className={styles.training__block}>
        <h2 className={styles.training__title}>Упражнения тренировки</h2>

        {loading ? (
          <Skeleton
            baseColor={baseSkeletonColor}
            width={1160}
            height={639}
            borderRadius={30}
          />
        ) : (
          <div className={styles.progress__block}></div>
        )}

        <Button>Заполнить свой прогресс</Button>
      </div>

      <WorkoutProgressModal
        isOpen={showFillProgress}
        onClose={() => setShowFillProgress}
      />
    </div>
  );
}
