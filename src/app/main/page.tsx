'use client';

import styles from './courses.module.css';
import { useAppSelector } from '@/store/store';
import CourseCard from '@/components/courseCard/CourseCard';
import Button from '@/components/button/Button';
import { useRef } from 'react';

export default function Main() {
  const { allCourses } = useAppSelector((state) => state.courses);
  const mainRef = useRef<HTMLDivElement>(null);

  const onButtonUpClick = (): void => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={mainRef} className={styles.main__container}>
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
        {allCourses.map((item) => (
          <CourseCard key={item._id} course={item} />
        ))}
      </div>

      <div className={styles.courses__up}>
        <Button text={'Наверх ↑'} onClick={onButtonUpClick} />
      </div>
    </div>
  );
}
