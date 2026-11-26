import apiClient from '@/services/apiClient';
import { BASE_URL } from '@/services/constants';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';

export const getAllCourses = async (): Promise<CourseType[]> => {
  return await apiClient.get(BASE_URL + '/courses').then((response) => {
    return response.data;
  });
};

export const getCourseById = async (id: string): Promise<CourseType> => {
  return await apiClient.get(BASE_URL + `/courses/${id}`).then((response) => {
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
  return await apiClient
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
  return apiClient.post(
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
  return apiClient.delete(BASE_URL + `/users/me/courses/${courseId}`, {
    headers: {
      'content-type': '',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const resetCourseProgress = async (access: string, courseId: string) => {
  return await apiClient
    .patch(
      BASE_URL + `/courses/${courseId}/reset`,
      {},
      {
        headers: {
          'content-type': '',
          Authorization: `Bearer ${access}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    });
};
