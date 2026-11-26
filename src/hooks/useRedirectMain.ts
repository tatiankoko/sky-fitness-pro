'use client';

import { useAppSelector } from '@/store/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useRedirectMain = () => {
  const { authInitialized, user } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (authInitialized && !user) {
      router.replace('/main');
    }
  }, [authInitialized, router, user]);
};
