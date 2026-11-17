import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getCourseProgress } from '@/services/course/courseApi';
import { addMyCourseProgress } from '@/store/features/courseSlice';
import { CourseProgressType } from '@/sharedTypes/sharedTypes';
import { isInvalidToken } from '@/utils/helper';
import { setLogout } from '@/store/features/authSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

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
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          setErrorMsg(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, courseId]);

  return {
    isLoading,
    errorMsg,
    courseProgress,
  };
};
