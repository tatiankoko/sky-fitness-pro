import { ReactNode } from 'react';
import styles from './main.module.css';
import classNames from 'classnames';

interface CoursesLayoutProps {
  children: ReactNode;
  auth: ReactNode;
}

export default function Courses({ children, auth }: CoursesLayoutProps) {
  return (
    <>
      <div className={styles.wrapper}>
        <p className={classNames(styles.page__description, styles.center)}>
          Онлайн-тренировки для занятий дома
        </p>
        {children}
      </div>
      {auth}
    </>
  );
}
