import { useEffect, useRef } from 'react';
import { getAllCourses } from '@/services/course/courseApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  startCoursesFetch,
  setAllCourses,
  setCoursesFetchError,
} from '@/store/features/courseSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { CourseType } from '@/sharedTypes/sharedTypes';

export const useFetchCourses = () => {
  const dispatch = useAppDispatch();
  const {
    allCourses,
    fetchAllCoursesIsLoading,
    fetchAllCoursesError,
    allCoursesRequested,
  } = useAppSelector((state) => state.courses);
  const coursesRequest = useRef<Promise<CourseType[]> | null>(null);

  useEffect(() => {
    if (
      fetchAllCoursesIsLoading ||
      fetchAllCoursesError ||
      allCoursesRequested
    ) {
      return;
    }

    if (allCourses.length) {
      dispatch(setAllCourses(allCourses));
      return;
    }

    dispatch(startCoursesFetch());

    const request =
      coursesRequest.current ?? (coursesRequest.current = getAllCourses());

    request
      .then((courses) => dispatch(setAllCourses(courses)))
      .catch((error) => {
        dispatch(setCoursesFetchError(getApiErrorMessage(error)));
      })
      .finally(() => {
        if (coursesRequest.current === request) {
          coursesRequest.current = null;
        }
      });
  }, []);
};
