import { CourseType } from '@/sharedTypes/sharedTypes';
import React from 'react';

export interface ImageStyleType {
  key: number;
  color: string;
  bottom: string;
  right: string;
  width: number;
  height: number;
}

const imageColors: ImageStyleType[] = [
  {
    key: 1,
    color: '#FFC700',
    bottom: '-4px',
    right: '90px',
    width: 360,
    height: 400,
  },
  {
    key: 2,
    color: '#2491D2',
    bottom: '-20px',
    right: '0',
    width: 360,
    height: 325,
  },
  {
    key: 3,
    color: '#F7A012',
    bottom: '-20px',
    right: '70px',
    width: 360,
    height: 325,
  },
  {
    key: 4,
    color: '#FF7E65',
    bottom: '50px',
    right: '70px',
    width: 460,
    height: 400,
  },
  {
    key: 5,
    color: '#7D458C',
    bottom: '-40px',
    right: '-110px',
    width: 779,
    height: 400,
  },
];

export const courseImageStyleParams = (
  course: CourseType | null,
): ImageStyleType | undefined => {
  return imageColors.find((pair) => pair.key === course?.order);
};

export const courseImageCss = (
  course: CourseType | null,
): React.CSSProperties => {
  return {
    width: course?.order === 4 ? '150%' : course?.order === 1 ? '95%' : '100%',
    objectFit: 'cover',
    objectPosition: 'bottom',
    position: 'absolute',
    bottom: courseImageStyleParams(course)?.bottom,
    right: courseImageStyleParams(course)?.right,
    zIndex: 10,
  };
};

export const courseImageSrc = (course: CourseType | null) => {
  return `/img/course_${course?.order}${course?.order === 4 || course?.order === 5 ? '_full.jpg' : '.png'}`;
};
