import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { AxiosError } from 'axios';
import { getCourseProgress } from '@/services/course/courseApi';
import { addMyCourseProgress } from '@/store/features/courseSlice';
import { CourseProgressType } from '@/sharedTypes/sharedTypes';

export const useFetchCourseProgress = (courseId: string) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] =
    useState<CourseProgressType | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    setIsLoading(true);
    setErrorMsg(null);

    getCourseProgress(accessToken, courseId)
      .then((courseProgress) => {
        setCourseProgress(courseProgress);
        dispatch(addMyCourseProgress(courseProgress));
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
  }, [accessToken]);

  return {
    isLoading,
    errorMsg,
    courseProgress,
  };
};
