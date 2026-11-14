import axios from 'axios';
import { BASE_URL } from '@/services/constants';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';

export const getAllCourses = async (): Promise<CourseType[]> => {
  return await axios.get(BASE_URL + '/courses').then((response) => {
    return response.data;
  });
};

export const getCourseById = async (id: string): Promise<CourseType> => {
  return await axios.get(BASE_URL + `/courses/${id}`).then((response) => {
    return response.data;
  });
};

export type MyCoursesResponseType = {
  courseProgress: CourseProgressType[];
  selectedCourses: string[];
};

export const getMyCourses = async (
  access: string,
): Promise<MyCoursesResponseType> => {
  return await axios
    .get(BASE_URL + '/users/me', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((response) => {
      return response.data.user;
    });
};

export const addCourse = async (
  accessToken: string,
  courseId: string,
): Promise<CourseType> => {
  return axios.post(
    BASE_URL + '/users/me/courses',
    { courseId: courseId },
    {
      headers: {
        'content-type': '',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const removeCourse = async (accessToken: string, courseId: string) => {
  return axios.delete(BASE_URL + `/users/me/courses/${courseId}`, {
    headers: {
      'content-type': '',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getCourseProgress = async (
  access: string,
  courseId: string,
): Promise<CourseProgressType> => {
  return await axios
    .get(BASE_URL + `/users/me/progress?courseId=${courseId}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((response) => {
      return response.data;
    });
};
