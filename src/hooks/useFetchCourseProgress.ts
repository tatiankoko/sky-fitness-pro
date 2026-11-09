import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { AxiosError } from 'axios';
import { getCourseProgress } from '@/services/course/courseApi';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { addCourseProgress } from '@/store/features/courseSlice';

export const useFetchCourseProgress = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const { myCourses } = useAppSelector((state) => state.courses);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    console.log('useFetchCourseProgress');
    if (!accessToken || myCourses.length <= 0) return;

    setIsLoading(true);
    setErrorMsg(null);

    myCourses.map((course: CourseType) => {
      getCourseProgress(accessToken, course._id)
        .then((workouts) => {
          dispatch(addCourseProgress(workouts));
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
    });
  }, [myCourses, accessToken]);

  return {
    isLoading,
    errorMsg,
    myCourses,
  };
};
