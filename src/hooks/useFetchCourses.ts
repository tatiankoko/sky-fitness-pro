import { useEffect } from 'react';
import { getAllCourses } from '@/services/course/courseApi';
import { useAppDispatch } from '@/store/store';
import {
  setAllCourses,
  setFetchError,
  setFetchIsLoading,
} from '@/store/features/courseSlice';
import { AxiosError } from 'axios';

export const useFetchCourses = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setFetchIsLoading(true));

    getAllCourses()
      .then((courses) => {
        dispatch(setAllCourses(courses));
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            dispatch(setFetchError(error.response.data));
          } else if (error.request) {
            dispatch(setFetchError('Произошла ошибка. Попробуйте позже'));
          } else {
            dispatch(setFetchError('Неизвестная ошибка'));
          }
        }
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
  }, []);
};
