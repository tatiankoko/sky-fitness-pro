import axios, { AxiosError } from 'axios';
import { setLogout } from '@/store/features/authSlice';
import type { AppDispatch } from '@/store/store';

const apiClient = axios.create();

let unauthorizedInterceptorId: number | null = null;

export const setupApiInterceptors = (dispatch: AppDispatch) => {
  if (unauthorizedInterceptorId !== null) {
    apiClient.interceptors.response.eject(unauthorizedInterceptorId);
  }

  unauthorizedInterceptorId = apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (
        error.response?.status === 401 &&
        error.config?.headers?.get('Authorization')
      ) {
        dispatch(setLogout());
      }

      return Promise.reject(error);
    },
  );
};

export default apiClient;
