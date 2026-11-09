'use client';

import { addCourse, removeCourse } from '@/services/course/courseApi';
import { addMyCourse, removeMyCourse } from '@/store/features/courseSlice';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { useCallback } from 'react';

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
        .then((message) => {
          console.log(message);
          dispatch(actionSlice(course));
          toast.success(`Курс успешно ${add ? 'добавлен' : 'удален'}!`);
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
    },
    [dispatch, accessToken],
  );
};
