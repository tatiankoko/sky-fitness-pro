import axios from 'axios';
import { BASE_URL } from '@/services/constants';
import { CourseType } from '@/sharedTypes/sharedTypes';

export const getAllCourses = async (): Promise<CourseType[]> => {
  return await axios.get(BASE_URL + '/courses').then((response) => {
    return response.data;
  });
};

/*
{
        "dailyDurationInMinutes": {
            "from": 45,
            "to": 60
        },
        "_id": "ypox9r",
        "description": "Фитнес и танцы – что между ними общего? А то, что они могут великолепно сочетаться и оказывать просто восхитительный эффект на ваше тело! Объединение хореографии и аэробики – это необычно и интересно, именно так родился танцевальный фитнес, которым вы теперь можете заниматься дома. Достичь отличной формы и при этом получить удовольствие вам поможет видео для похудения, которое мы представляем на этой странице – делайте упражнения, танцуйте и чувствуйте, как ваше тело меняется в лучшую сторону!",
        "directions": [
            "Зумба",
            "Dance-mix",
            "Caribbean-mix"
        ],
        "fitting": [
            "Хотите укрепить мышцы, но тренировки в тренажерном зале для вас скучные и однообразные",
            "Хотите сбросить лишний вес, но нет желания мучать себя диетами",
            "Любите танцы и хотите совместить приятное с полезным."
        ],
        "nameEN": "Fitness",
        "nameRU": "Фитнес",
        "order": 3,
        "difficulty": "сложный",
        "durationInDays": 20,
        "workouts": [
            "gh7bd5",
            "hwsut5",
            "n18r8v",
            "dq9rzo",
            "rr70ie"
        ],
        "__v": 0
    },
 */
