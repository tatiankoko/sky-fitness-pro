import { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const responseData = error.response.data;
      return typeof responseData === 'string'
        ? responseData
        : (responseData?.message ?? 'Произошла ошибка. Попробуйте позже');
    } else if (error.request) {
      return 'Произошла ошибка. Попробуйте позже';
    } else {
      return 'Неизвестная ошибка';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Произошла ошибка. Попробуйте позже';
}
