'use client';

import styles from './courseCard.module.css';
import Image from 'next/image';
import {
  CourseInfo,
  CourseProgressType,
  CourseType,
} from '@/sharedTypes/sharedTypes';
import InfoItem from '@/components/infoItem/InfoItem';
import React, { useCallback, useState } from 'react';
import { useAppSelector } from '@/store/store';
import { useToggleAddCourseAction } from '@/hooks/useToggleAddCourseAction';
import { toast } from 'react-toastify';
import CourseProgressContent from '@/components/courseProgressContent/CourseProgressContent';

type CourseCardProps = {
  course: CourseType;
  courseProgress?: CourseProgressType;
  isAdded?: boolean;
  showUserContent?: boolean;
  onClickAction?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onWorkoutAction?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

export default function CourseCard({
  course,
  courseProgress,
  isAdded = false,
  showUserContent = false,
  onClickAction,
  onWorkoutAction,
}: CourseCardProps) {
  const { accessToken } = useAppSelector((state) => state.user);
  const { myCourses } = useAppSelector((state) => state.courses);
  const [loading, setLoading] = useState<boolean>(false);
  const toggleAddCourse = useToggleAddCourseAction();

  const onToggleAddCourse = useCallback(
    (event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();

      if (loading) return;

      if (!accessToken) {
        toast.info('Авторизуйтесь, чтобы добавить курс');
        return;
      }

      const contains = myCourses.find((item) => item._id === course._id);

      toggleAddCourse({
        add: !contains,
        course: course,
        setIsLoading: setLoading,
        setErrorMsg: toast.error,
      });
    },
    [accessToken, myCourses, loading, course, toggleAddCourse],
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

        {showUserContent ? (
          <CourseProgressContent
            course={course}
            courseProgress={courseProgress}
            isActionLoading={loading}
            onWorkoutAction={onWorkoutAction}
          />
        ) : null}
      </div>
    </div>
  );
}
