import axios from 'axios';
import { BASE_URL } from '@/services/constants';
import { WorkoutProgressType, WorkoutType } from '@/sharedTypes/sharedTypes';

export const getWorkouts = async (
  access: string,
  courseId: string,
): Promise<WorkoutType[]> => {
  return await axios
    .get(BASE_URL + `/courses/${courseId}/workouts`, {
      headers: {
        'content-type': '',
        Authorization: `Bearer ${access}`,
      },
    })
    .then((response) => {
      return response.data;
    });
};

export const getWorkoutById = async (
  access: string,
  workoutId: string,
): Promise<WorkoutType> => {
  return await axios
    .get(BASE_URL + `/workouts/${workoutId}`, {
      headers: {
        'content-type': '',
        Authorization: `Bearer ${access}`,
      },
    })
    .then((response) => {
      return response.data;
    });
};

interface workoutProgressProps {
  access: string;
  courseId: string;
  workoutId: string;
}

export const getWorkoutProgress = async ({
  access,
  courseId,
  workoutId,
}: workoutProgressProps): Promise<WorkoutProgressType> => {
  return await axios
    .get(
      BASE_URL +
        `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
      {
        headers: {
          'content-type': '',
          Authorization: `Bearer ${access}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    });
};

interface saveWorkoutProgressProps extends workoutProgressProps {
  progressData: number[];
}

export const saveWorkoutProgress = async ({
  access,
  courseId,
  workoutId,
  progressData,
}: saveWorkoutProgressProps) => {
  return await axios
    .patch(
      BASE_URL + `/courses/${courseId}/workouts/${workoutId}`,
      { progressData: progressData },
      {
        headers: {
          'content-type': '',
          Authorization: `Bearer ${access}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    });
};
