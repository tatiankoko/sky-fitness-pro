'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getWorkouts } from '@/services/workout/workoutApi';
import {
  addWorkout,
  setWorkoutFetchError,
  startWorkoutFetch,
} from '@/store/features/workoutSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { isInvalidToken } from '@/utils/helper';

export const useFetchWorkouts = (courseId?: string, enabled = true) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const { allWorkouts, fetchErrorByCourse, fetchIsLoadingByCourse } =
    useAppSelector((state) => state.workouts);

  useEffect(() => {
    if (!enabled || !courseId || !accessToken) {
      return;
    }

    if (
      fetchIsLoadingByCourse[courseId] ||
      fetchErrorByCourse[courseId] ||
      allWorkouts.some((item) => item.courseId === courseId)
    ) {
      return;
    }

    dispatch(startWorkoutFetch({ courseId }));

    getWorkouts(accessToken, courseId)
      .then((workouts) => dispatch(addWorkout({ courseId, workouts })))
      .catch((error) => {
        if (!isInvalidToken(error)) {
          dispatch(
            setWorkoutFetchError({
              courseId,
              error: getApiErrorMessage(error),
            }),
          );
        }
      });
  }, [accessToken, courseId, dispatch, enabled]);

  return {
    isLoading: courseId ? (fetchIsLoadingByCourse[courseId] ?? null) : false,
    errorMsg: courseId ? (fetchErrorByCourse[courseId] ?? null) : null,
    workouts:
      allWorkouts.find((item) => item.courseId === courseId)?.workouts ?? [],
  };
};
