import { CourseType } from '@/sharedTypes/sharedTypes';

export const COURSE_IMAGE_HEIGHT = 310;

interface CourseImageParams {
  color: string;
  width: number;
  marginRight?: number;
}

const courseImageByOrder: Record<number, CourseImageParams> = {
  1: { color: '#FFC700', width: 792 },
  2: { color: '#2491D2', width: 360 },
  3: { color: '#F7A012', width: 830 },
  4: { color: '#FF7E65', width: 531, marginRight: 30 },
  5: { color: '#7D458C', width: 668 },
};

export const courseImageStyleParams = (
  course: CourseType | null,
): CourseImageParams | undefined => {
  return course?.order ? courseImageByOrder[course.order] : undefined;
};

export const courseImageSrc = (course: CourseType | null) => {
  return `/img/course_${course?.order}_full.png`;
};

export const courseImageSrcMobile = (course: CourseType | null) => {
  return `/img/course_${course?.order}.png`;
};
