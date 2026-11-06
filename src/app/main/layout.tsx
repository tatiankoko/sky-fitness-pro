'use client';

import { ReactNode } from 'react';
import styles from './main.module.css';
import { useFetchCourses } from '@/hooks/useFetchCourses';
import classNames from 'classnames';

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function Courses({ children }: CoursesLayoutProps) {
  useFetchCourses();

  return (
    <div className={styles.wrapper}>
      <p className={classNames(styles.page__description, styles.center)}>
        Онлайн-тренировки для занятий дома
      </p>
      {children}
    </div>
  );
}
