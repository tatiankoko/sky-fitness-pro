import {
  COURSE_IMAGE_HEIGHT,
  courseImageStyleParams,
  courseImageSrc,
  courseImageSrcMobile,
} from './courseImageConstants';
import { CourseType } from '@/sharedTypes/sharedTypes';

const course = (order: number) => ({ order }) as CourseType;

describe('courseImageConstants', () => {
  it('общая высота картинок — 310', () => {
    expect(COURSE_IMAGE_HEIGHT).toBe(310);
  });

  it('возвращает параметры для всех пяти курсов', () => {
    expect(courseImageStyleParams(course(1))).toEqual({
      color: '#FFC700',
      width: 792,
    });
    expect(courseImageStyleParams(course(2))).toEqual({
      color: '#2491D2',
      width: 360,
    });
    expect(courseImageStyleParams(course(3))).toEqual({
      color: '#F7A012',
      width: 830,
    });
    expect(courseImageStyleParams(course(5))).toEqual({
      color: '#7D458C',
      width: 668,
    });
  });

  it('только четвёртый курс имеет отступ справа 30px', () => {
    expect(courseImageStyleParams(course(4))).toEqual({
      color: '#FF7E65',
      width: 531,
      marginRight: 30,
    });
    expect(courseImageStyleParams(course(1))?.marginRight).toBeUndefined();
  });

  it('undefined для неизвестного order и null', () => {
    expect(courseImageStyleParams(course(99))).toBeUndefined();
    expect(courseImageStyleParams(null)).toBeUndefined();
  });

  it('строит пути к десктопной и мобильной картинкам', () => {
    expect(courseImageSrc(course(2))).toBe('/img/course_2_full.png');
    expect(courseImageSrcMobile(course(2))).toBe('/img/course_2.png');
  });
});
