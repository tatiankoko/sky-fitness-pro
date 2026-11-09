import axios from 'axios';
import { BASE_URL } from '@/services/constants';
import { WorkoutType } from '@/sharedTypes/sharedTypes';

/*
{
        "_id": "a1rqtt",
        "name": "Урок 2. Основные движения",
        "video": "https://www.youtube.com/embed/gJPs7b8SpVw",
        "exercises": [],
        "__v": 0
    },
    {
        "_id": "e9ghsb",
        "name": "Урок 1. Основы",
        "video": "https://www.youtube.com/embed/oK2mdodtPY4",
        "exercises": [],
        "__v": 0
    },
    {
        "_id": "mstcbg",
        "name": "Урок 3. Новые движения",
        "video": "https://www.youtube.com/embed/PGAQfXIAY7k",
        "exercises": [],
        "__v": 0
    },
    {
        "_id": "t3cpno",
        "name": "Урок 4. Продвинутые движения",
        "video": "https://www.youtube.com/embed/zuBLSarZuyk",
        "exercises": [],
        "__v": 0
    }
 */
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
