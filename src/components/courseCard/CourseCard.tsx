'use client';

import styles from './courseCard.module.css';
import Image from 'next/image';
import { CourseInfo, CourseType } from '@/sharedTypes/sharedTypes';
import InfoItem from '@/components/infoItem/InfoItem';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addCourse, removeCourse } from '@/services/course/courseApi';
import { AxiosError } from 'axios';
import { addMyCourse, removeMyCourse } from '@/store/features/courseSlice';

type CourseCardProps = {
  course: CourseType;
  isAdded?: boolean;
  onClickAction?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function CourseCard({
  course,
  isAdded = false,
  onClickAction,
}: CourseCardProps) {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  const { myCourses } = useAppSelector((state) => state.courses);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg(null);
    }
  }, [errorMsg]);

  const onToggleAddCourse = useCallback(
    (event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isLoading) return;

      if (!accessToken) {
        toast.info('Авторизуйтесь, чтобы добавить курс');
        return;
      }

      const contains = myCourses.find((item) => item._id === course._id);
      const actionApi = contains ? removeCourse : addCourse;
      const actionSlice = contains ? removeMyCourse : addMyCourse;
      console.log(contains ? 'remove course' : 'add course');

      actionApi(accessToken || '', course._id)
        .then((message) => {
          console.log(message);
          dispatch(actionSlice(course));
          toast.success(`Курс успешно ${contains ? 'удален' : 'добавлен'}!`);
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
    [accessToken, myCourses],
  );

  return (
    <div className={styles.wrapper} onClick={onClickAction}>
      <div className={styles.image__block}>
        <Image
          width={360}
          height={325}
          src={`/img/course_${course?.order}.png`}
          alt={`изображение курса ${course?.nameRU}`}
          loading="eager"
        ></Image>
        <svg className={styles.image__button} onClick={onToggleAddCourse}>
          <use
            xlinkHref={`/img/icon/sprite.svg#icon-${isAdded ? 'remove' : 'add'}`}
          ></use>
        </svg>
      </div>

      <div className={styles.course__block}>
        <h2 className={styles.course__title}>{course?.nameRU}</h2>

        <div className={styles.course__info}>
          <InfoItem type={CourseInfo.durationInDays} course={course} />
          <InfoItem type={CourseInfo.dailyDurationInMinutes} course={course} />
          <InfoItem type={CourseInfo.difficulty} course={course} />
        </div>
      </div>

      <div className={styles.progress__block}>
        <h3 className={styles.progress__title}></h3>
        <progress className={styles.progress__indicator}></progress>
      </div>
    </div>
  );
}
