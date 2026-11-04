'use client';

import { ReactNode } from 'react';
import { useInitAuth } from '@/hooks/useInitAuth';
import Header from '@/components/header/Header';

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function Courses({ children }: CoursesLayoutProps) {
  useInitAuth();

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
