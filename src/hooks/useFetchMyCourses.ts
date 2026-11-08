import { useEffect, useState } from 'react';
import { getMyCourses } from '@/services/course/courseApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setMyCourses } from '@/store/features/courseSlice';
import { AxiosError } from 'axios';

export const useFetchMyCourses = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const { allCourses, myCourses } = useAppSelector((state) => state.courses);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || allCourses.length <= 0) return;

    setIsLoading(true);
    setErrorMsg(null);

    getMyCourses(accessToken || '')
      .then((courseIds) => {
        dispatch(
          setMyCourses(
            allCourses.filter((course) =>
              courseIds.selectedCourses.includes(course._id),
            ),
          ),
        );
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
  }, [allCourses, accessToken]);

  return {
    isLoading,
    errorMsg,
    myCourses,
  };
};
