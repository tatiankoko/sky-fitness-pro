'use client';

import styles from './main.module.css';
import { useAppSelector } from '@/store/store';
import CourseCard from '@/components/courseCard/CourseCard';
import Button from '@/components/button/Button';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import CourseCardSkeleton from '@/components/courseCardSkeleton/CourseCardSkeleton';
import { useFetchCourses } from '@/hooks/useFetchCourses';
import { toast } from 'react-toastify';
import { useFetchMyCourses } from '@/hooks/useFetchMyCourses';

export default function Main() {
  useFetchCourses();
  useFetchMyCourses();

  const {
    allCourses,
    selectedCourseIds,
    fetchAllCoursesIsLoading,
    fetchAllCoursesError,
  } = useAppSelector((state) => state.courses);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchAllCoursesError) toast.error(fetchAllCoursesError);
  }, [fetchAllCoursesError]);

  const onButtonUpClick = (): void => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      ref={mainRef}
      className={classNames(styles.main__container, styles.center)}
    >
      <div className={styles.header__block}>
        <h1 className={styles.header__title}>
          Начните заниматься спортом
          <br /> и улучшите качество жизни
        </h1>

        <div className={styles.subtitle__wrapper}>
          <p className={styles.header__subtitle}>
            Измени своё
            <br />
            тело за полгода!
          </p>
          <svg className={styles.subtitle__icon}>
            <use xlinkHref="/img/icon/sprite.svg#icon-polygon"></use>
          </svg>
        </div>
      </div>

      <div className={styles.courses__block}>
        {fetchAllCoursesIsLoading ? (
          <>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </>
        ) : (
          allCourses.map((course) => (
            <Link href={`/main/course/${course._id}`} key={course._id}>
              <CourseCard
                course={course}
                isAdded={selectedCourseIds.includes(course._id)}
              />
            </Link>
          ))
        )}
      </div>

      <div className={styles.courses__up}>
        <Button onClick={onButtonUpClick}>Наверх ↑</Button>
      </div>
    </div>
  );
}
