'use client';

import { useAppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { setAccessToken, setUser, setIsAuth } from '@/store/features/authSlice';
import { userType } from '@/sharedTypes/sharedTypes';

export const useInitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';
    const user: userType =
      JSON.parse(<string>localStorage.getItem('user')) || null;

    dispatch(setUser(user));
    dispatch(setAccessToken(accessToken));
    dispatch(setIsAuth());
  }, [dispatch]);
};
