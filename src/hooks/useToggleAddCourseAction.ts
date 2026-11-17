'use client';

import { addCourse, removeCourse } from '@/services/course/courseApi';
import { addMyCourse, removeMyCourse } from '@/store/features/courseSlice';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { useCallback } from 'react';
import { isInvalidToken } from '@/utils/helper';
import { setLogout } from '@/store/features/authSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

interface toggleAddCourseProps {
  add: boolean;
  course: CourseType;
  setIsLoading: (state: boolean) => void;
  setErrorMsg: (state: string) => void;
}

export const useToggleAddCourseAction = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);

  return useCallback(
    ({ add, course, setIsLoading, setErrorMsg }: toggleAddCourseProps) => {
      const actionApi = add ? addCourse : removeCourse;
      const actionSlice = add ? addMyCourse : removeMyCourse;

      setIsLoading(true);

      actionApi(accessToken || '', course._id)
        .then(() => {
          dispatch(actionSlice(course));
          toast.success(`Курс успешно ${add ? 'добавлен' : 'удален'}!`);
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
    },
    [dispatch, accessToken],
  );
};
