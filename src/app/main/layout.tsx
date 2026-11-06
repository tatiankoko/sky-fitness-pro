'use client';

import { ReactNode } from 'react';
import styles from './main.module.css';
import { useFetchCourses } from '@/hooks/useFetchCourses';

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function Courses({ children }: CoursesLayoutProps) {
  useFetchCourses();

  return (
    <div className={styles.wrapper}>
      <p className={styles.page__description}>
        Онлайн-тренировки для занятий дома
      </p>
      {children}
    </div>
  );
}
