import axios from 'axios';
import { BASE_URL } from '@/services/constants';

type authUserProps = {
  email: string;
  password: string;
};

type authUserResponse = {
  token: string;
};

export const authUser = async (
  data: authUserProps,
): Promise<authUserResponse> => {
  const response = await axios.post(BASE_URL + '/auth/login/', data, {
    headers: {
      'content-type': '',
    },
  });
  return response.data;
};

type regUserResponse = {
  token?: string;
  message?: string;
};

export const registerUser = async (
  data: authUserProps,
): Promise<regUserResponse> => {
  const response = await axios.post(BASE_URL + '/auth/register/', data, {
    headers: {
      'content-type': '',
    },
  });
  return response.data;
};
