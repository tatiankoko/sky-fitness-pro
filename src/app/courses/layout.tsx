'use client';

import { ReactNode } from 'react';
import { useInitAuth } from '@/hooks/useInitAuth';
import Header from '@/components/header/Header';
import styles from './courses.module.css';

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function Courses({ children }: CoursesLayoutProps) {
  useInitAuth();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
