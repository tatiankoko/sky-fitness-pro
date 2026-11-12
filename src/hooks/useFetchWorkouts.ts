'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { AxiosError } from 'axios';
import { getWorkouts } from '@/services/workout/workoutApi';
import { addWorkout } from '@/store/features/workoutSlice';
import { WorkoutType } from '@/sharedTypes/sharedTypes';

export const useFetchWorkouts = (courseId?: string, enabled = true) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const { myCourses } = useAppSelector((state) => state.courses);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);

  useEffect(() => {
    if (!enabled || !courseId || !accessToken || myCourses.length <= 0) return;

    setIsLoading(true);
    setErrorMsg(null);

    getWorkouts(accessToken, courseId)
      .then((workoutsList) => {
        setWorkouts(workoutsList);
        dispatch(addWorkout({ courseId: courseId, workouts: workoutsList }));
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMsg(error.response.data);
          } else if (error.request) {
            setErrorMsg('Произошла ошибка. Попробуйте позже');
          } else {
            setErrorMsg('Неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [myCourses, accessToken, courseId, enabled, dispatch]);

  return {
    isLoading,
    errorMsg,
    workouts,
  };
};
