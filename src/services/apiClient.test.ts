import { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosAdapter, AxiosResponse } from 'axios';
import apiClient, { setupApiInterceptors } from './apiClient';
import { setLogout } from '@/store/features/authSlice';
import { makeStore } from '@/store/store';

const unauthorizedAdapter: AxiosAdapter = (config) => {
  const response: AxiosResponse = {
    data: {},
    status: 401,
    statusText: 'Unauthorized',
    headers: new AxiosHeaders(),
    config,
  };

  return Promise.reject(
    new AxiosError(
      'Unauthorized',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      response,
    ),
  );
};

describe('apiClient response interceptor', () => {
  it('logs out for unauthorized authenticated requests', async () => {
    const store = makeStore();
    const dispatch = jest.spyOn(store, 'dispatch');
    setupApiInterceptors(store.dispatch);

    await expect(
      apiClient.get('/private', {
        headers: { Authorization: 'Bearer expired-token' },
        adapter: unauthorizedAdapter,
      }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(dispatch).toHaveBeenCalledWith(setLogout());
  });

  it('does not log out for unauthorized unauthenticated requests', async () => {
    const store = makeStore();
    const dispatch = jest.spyOn(store, 'dispatch');
    setupApiInterceptors(store.dispatch);

    await expect(
      apiClient.get('/public', { adapter: unauthorizedAdapter }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(dispatch).not.toHaveBeenCalled();
  });
});
