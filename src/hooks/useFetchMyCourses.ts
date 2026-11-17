import { useEffect } from 'react';
import { getMyCourses } from '@/services/course/courseApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setMyCoursesFetchError,
  setMyCoursesResponse,
  startMyCoursesFetch,
} from '@/store/features/courseSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { setLogout } from '@/store/features/authSlice';
import { isInvalidToken } from '@/utils/helper';

export const useFetchMyCourses = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const {
    myCourses,
    fetchMyCoursesIsLoading,
    fetchMyCoursesError,
    myCoursesRequested,
  } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (
      !accessToken ||
      fetchMyCoursesIsLoading ||
      fetchMyCoursesError ||
      myCoursesRequested
    ) {
      return;
    }

    dispatch(startMyCoursesFetch());

    getMyCourses(accessToken)
      .then((response) => dispatch(setMyCoursesResponse(response)))
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          dispatch(setMyCoursesFetchError(getApiErrorMessage(error)));
        }
      });
  }, [accessToken, myCoursesRequested, dispatch]);

  return {
    isLoading: fetchMyCoursesIsLoading,
    errorMsg: fetchMyCoursesError,
    myCourses,
  };
};
