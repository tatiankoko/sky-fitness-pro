import { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { getApiErrorMessage } from './getApiErrorMessage';

const FALLBACK = 'Произошла ошибка. Попробуйте позже';
const NETWORK_ERROR = 'Нет соединения / проверьте интернет.';

const withResponse = (data: unknown) =>
  new AxiosError('error', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 400,
    data,
  } as AxiosResponse);

describe('getApiErrorMessage', () => {
  it('возвращает строковое тело ответа как есть', () => {
    expect(getApiErrorMessage(withResponse('Курс не найден'))).toBe(
      'Курс не найден',
    );
  });

  it('достаёт message из объекта ответа', () => {
    expect(getApiErrorMessage(withResponse({ message: 'Неверный пароль' }))).toBe(
      'Неверный пароль',
    );
  });

  it('fallback, если в объекте ответа нет message', () => {
    expect(getApiErrorMessage(withResponse({}))).toBe(FALLBACK);
    expect(getApiErrorMessage(withResponse(null))).toBe(FALLBACK);
  });

  it('показывает понятное сообщение при сетевой ошибке', () => {
    const error = new AxiosError(
      'Network Error',
      'ERR_NETWORK',
      undefined,
      {} as XMLHttpRequest,
    );
    expect(getApiErrorMessage(error)).toBe(NETWORK_ERROR);
  });

  it('показывает понятное сообщение при прерывании запроса по таймауту', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED');
    expect(getApiErrorMessage(error)).toBe(NETWORK_ERROR);
  });

  it('«Неизвестная ошибка» для AxiosError без request и response', () => {
    expect(getApiErrorMessage(new AxiosError('oops'))).toBe(
      'Неизвестная ошибка',
    );
  });

  it('возвращает message обычного Error', () => {
    expect(getApiErrorMessage(new Error('Что-то пошло не так'))).toBe(
      'Что-то пошло не так',
    );
  });

  it('fallback для Error с пустым message', () => {
    expect(getApiErrorMessage(new Error(''))).toBe(FALLBACK);
  });

  it('fallback для не-Error значений', () => {
    expect(getApiErrorMessage(null)).toBe(FALLBACK);
    expect(getApiErrorMessage(undefined)).toBe(FALLBACK);
    expect(getApiErrorMessage('просто строка')).toBe(FALLBACK);
    expect(getApiErrorMessage({ message: 'не Error' })).toBe(FALLBACK);
  });
});
