'use client';

import { useAppSelector } from '@/store/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useRedirectMain = () => {
  const { isAuth, user } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (isAuth && !user) {
      router.replace('/main');
    }
  }, [isAuth, router, user]);
};
