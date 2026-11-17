'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getWorkouts } from '@/services/workout/workoutApi';
import {
  addWorkout,
  setWorkoutFetchError,
  startWorkoutFetch,
} from '@/store/features/workoutSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { WorkoutType } from '@/sharedTypes/sharedTypes';
import { setLogout } from '@/store/features/authSlice';
import { isInvalidToken } from '@/utils/helper';

export const useFetchWorkouts = (courseId?: string, enabled = true) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const { allWorkouts, fetchErrorByCourse, fetchIsLoadingByCourse } =
    useAppSelector((state) => state.workouts);
  const workoutRequests = useRef<Map<string, Promise<WorkoutType[]>>>(
    new Map<string, Promise<WorkoutType[]>>(),
  );

  useEffect(() => {
    if (!enabled || !courseId || !accessToken) {
      return;
    }

    if (
      fetchIsLoadingByCourse[courseId] === null ||
      fetchErrorByCourse[courseId] === null
    ) {
      return;
    }

    dispatch(startWorkoutFetch({ courseId }));

    const key = `${accessToken}:${courseId}`;
    let request = workoutRequests.current.get(key);
    if (!request) {
      request = getWorkouts(accessToken, courseId);
      workoutRequests.current.set(key, request);
    }

    request
      .then((workouts) => dispatch(addWorkout({ courseId, workouts })))
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          dispatch(
            setWorkoutFetchError({
              courseId,
              error: getApiErrorMessage(error),
            }),
          );
        }
      })
      .finally(() => {
        if (workoutRequests.current.get(key) === request)
          workoutRequests.current.delete(key);
      });
  }, [accessToken, courseId, dispatch, enabled]);

  return {
    isLoading: courseId ? (fetchIsLoadingByCourse[courseId] ?? null) : false,
    errorMsg: courseId ? (fetchErrorByCourse[courseId] ?? null) : null,
    workouts:
      allWorkouts.find((item) => item.courseId === courseId)?.workouts ?? [],
  };
};
