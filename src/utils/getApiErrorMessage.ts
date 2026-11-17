import { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      return error.response.data.message;
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
