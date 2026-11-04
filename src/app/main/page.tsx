'use client';

import styles from './courses.module.css';
import { useFetchCourses } from '@/hooks/useFetchCourses';

export default function Main() {
  useFetchCourses();

  return (
    <div className={styles.main__container}>
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

      <div className={styles.courses__block}></div>
    </div>
  );
}
