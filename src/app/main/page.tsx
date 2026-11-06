'use client';

import styles from './main.module.css';
import { useAppSelector } from '@/store/store';
import CourseCard from '@/components/courseCard/CourseCard';
import Button from '@/components/button/Button';
import { useRef } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import CourseCardSkeleton from '@/components/courseCardSkeleton/CourseCardSkeleton';

export default function Main() {
  const { allCourses, fetchIsLoading } = useAppSelector(
    (state) => state.courses,
  );
  const mainRef = useRef<HTMLDivElement>(null);

  const onButtonUpClick = (): void => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onCourseCardClick = (): void => {};

  return (
    <div
      ref={mainRef}
      className={classNames(styles.main__container, styles.center)}
    >
      <div className={styles.header__block}>
        <h1 className={styles.header__title}>
          Начните заниматься спортом
          <br />и улучшите качество жизни
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
        {fetchIsLoading ? (
          <>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </>
        ) : (
          allCourses.map((item) => (
            <Link href={`/main/course/${item._id}`} key={item._id}>
              <CourseCard course={item} onClick={onCourseCardClick} />
            </Link>
          ))
        )}
      </div>

      <div className={styles.courses__up}>
        <Button text={'Наверх ↑'} onClick={onButtonUpClick} />
      </div>
    </div>
  );
}
