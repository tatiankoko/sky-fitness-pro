'use client';

import styles from './course.module.css';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { getCourseById } from '@/services/course/courseApi';
import Button from '@/components/button/Button';
import Image from 'next/image';
import classNames from 'classnames';
import { setFetchIsLoading } from '@/store/features/courseSlice';
import { AxiosError } from 'axios';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { baseSkeletonColor } from '@/utils/constants';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

export default function Course() {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const { allCourses, fetchIsLoading } = useAppSelector(
    (state) => state.courses,
  );
  const { isAuth, accessToken } = useAppSelector((state) => state.user);
  const [course, setCourse] = useState<CourseType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (allCourses.length > 0) {
      setCourse(allCourses.find((course) => course._id === params.id) || null);
      return;
    }

    dispatch(setFetchIsLoading(true));

    getCourseById(params.id)
      .then((course) => {
        setCourse(course);
        // dispatch(setCurrentCourse(course)); // todo
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setError(error.response.data);
          } else if (error.request) {
            setError('Произошла ошибка. Попробуйте позже');
          } else {
            setError('Неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        dispatch(setFetchIsLoading(false));
      });
  }, []);

  const findImageStyle = (
    courseType: CourseType | null,
  ): ImageStyleType | undefined => {
    return imageColors.find((pair) => pair.key === courseType?.order);
  };

  interface ImageStyleType {
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

  const imageStyle: React.CSSProperties = {
    width: course?.order === 4 ? '150%' : course?.order === 1 ? '95%' : '100%',
    objectFit: 'cover',
    objectPosition: 'bottom',
    position: 'absolute',
    bottom: findImageStyle(course)?.bottom,
    right: findImageStyle(course)?.right,
    zIndex: 10,
  };

  const onAddCourse = () => {
    if (!accessToken) return;
  };

  if (!course) {
    return <></>;
  }

  return (
    <div className={styles.course__container}>
      {fetchIsLoading ? (
        <div className={styles.fitting__container}>
          <Skeleton
            baseColor={baseSkeletonColor}
            width={1160}
            height={310}
            borderRadius={30}
          />
        </div>
      ) : null}

      <div
        className={styles.header__container}
        style={{
          backgroundColor: findImageStyle(course)?.color,
        }}
      >
        <div className={styles.title__block}>
          <h1 className={styles.title__text}>{course.nameRU}</h1>
        </div>

        <div
          className={styles.image__block}
          style={{
            width: `${findImageStyle(course)?.width}px`,
            overflow: `${course?.order === 5 || course?.order === 4 ? 'hidden' : 'visible'}`,
          }}
        >
          <Image
            width={findImageStyle(course)?.width}
            height={findImageStyle(course)?.height}
            src={`/img/course_${course?.order}${course?.order === 4 || course?.order === 5 ? '_full.jpg' : '.png'}`}
            alt={`изображение курса ${course?.nameRU}`}
            loading="eager"
            style={imageStyle}
          ></Image>
        </div>
      </div>

      <div className={styles.fitting__container}>
        <h2 className={styles.block__title}>Подойдет для вас, если:</h2>

        <div className={styles.fitting__block}>
          {course.fitting.map((item, index) => (
            <div className={styles.fitting__item} key={index}>
              <span className={styles.fitting__number}>{index + 1}</span>
              <p className={styles.fitting__text}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Направления */}
      <div className={styles.directions__container}>
        <h2 className={styles.block__title}>Направления</h2>

        <div className={styles.directions__block}>
          {course.directions.map((item, index) => (
            <span className={styles.directions__item} key={index}>
              ✦ {item}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.addCourse__container}>
        {/* Image — вся ширина на mobile/tablet, скрыт в desktop */}
        <div className="block lg:hidden w-full overflow-hidden">
          <div className="w-full h-[336px] sm:h-[450px] md:h-[500px] bg-teal-700/60"></div>
        </div>

        {/* Белый блок с тенью */}
        <div className={styles.addCourse__block}>
          <div className={styles.addCourse__info}>
            <h2 className={styles.addCourse__title}>
              Начните путь к&nbsp;новому телу
            </h2>

            <ul className={styles.addCourse__list}>
              <li className={styles.addCourse__item}>
                проработка всех групп мышц
              </li>
              <li className={styles.addCourse__item}>тренировка суставов</li>
              <li className={styles.addCourse__item}>
                улучшение циркуляции крови
              </li>
              <li className={styles.addCourse__item}>
                упражнения заряжают бодростью
              </li>
              <li className={styles.addCourse__item}>
                помогают противостоять стрессам
              </li>
            </ul>

            <Button onClick={onAddCourse}>
              {isAuth ? 'Добавить курс' : 'Войдите, чтобы добавить курс'}
            </Button>
          </div>

          {/* Desktop заглушка изображения — only на lg+ */}
          <div
            className={classNames(styles.addCourse__image, styles.image_main)}
          >
            <Image
              width={487}
              height={538}
              src={'/img/crouching_man.png'}
              alt={
                'мужчина в зелёной рубашке-поло и тёмно-синих шортах сидит на корточках'
              }
              loading="eager"
            />
          </div>
          <div
            className={classNames(styles.addCourse__image, styles.image_bottom)}
          >
            <Image
              width={1160}
              height={532}
              src={'/img/mask.png'}
              alt={'зеленая полоса и черная дуга'}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
