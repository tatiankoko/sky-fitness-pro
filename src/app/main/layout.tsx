import { ReactNode } from 'react';
import styles from './courses.module.css';

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function Courses({ children }: CoursesLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.page__description}>
        Онлайн-тренировки для занятий дома
      </p>
      {children}
    </div>
  );
}
