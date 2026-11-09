'use client';

import styles from './course.module.css';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { getCourseById, getMyCourses } from '@/services/course/courseApi';
import Button from '@/components/button/Button';
import Image from 'next/image';
import classNames from 'classnames';
import { AxiosError } from 'axios';
import { baseSkeletonColor } from '@/utils/constants';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import {
  courseImageStyleParams,
  courseImageCss,
  courseImageSrc,
} from '@/app/main/course/[id]/courseImageConstants';
import { useToggleAddCourseAction } from '@/hooks/useToggleAddCourseAction';
import { CourseType } from '@/sharedTypes/sharedTypes';

export default function Course() {
  const params = useParams<{ id: string }>();
  const { allCourses, myCourses } = useAppSelector((state) => state.courses);
  const { accessToken } = useAppSelector((state) => state.user);
  const [course, setCourse] = useState<CourseType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState(false);
  const toggleAddCourse = useToggleAddCourseAction();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!accessToken) return;

    if (allCourses.length) {
      const foundCourse = allCourses.find((course) => course._id === params.id);

      if (foundCourse) {
        setCourse(foundCourse);
        setIsAdded(!!myCourses.find((item) => item._id === params.id));
        return;
      }
    }

    setLoading(true);

    getCourseById(params.id)
      .then((course) => {
        setCourse(course);
        return getMyCourses(accessToken || '');
      })
      .then((courseIds) => {
        setIsAdded(courseIds.selectedCourses.includes(params.id));
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
        setLoading(false);
      });
  }, [accessToken]);

  const onAddCourse = () => {
    if (!accessToken || !course) return;

    toggleAddCourse({
      add: true,
      course: course,
      setIsLoading: setLoading,
      setErrorMsg: setError,
    });

    if (!error) {
      setIsAdded(true);
    }
  };

  if (!course) {
    return <></>;
  }

  return (
    <div className={styles.course__container}>
      {loading ? (
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
          backgroundColor: courseImageStyleParams(course)?.color,
        }}
      >
        <div className={styles.title__block}>
          <h1 className={styles.title__text}>{course.nameRU}</h1>
        </div>

        <div
          className={styles.image__block}
          style={{
            width: `${courseImageStyleParams(course)?.width}px`,
            overflow: `${course?.order === 5 || course?.order === 4 ? 'hidden' : 'visible'}`,
          }}
        >
          <Image
            width={courseImageStyleParams(course)?.width}
            height={courseImageStyleParams(course)?.height}
            src={courseImageSrc(course)}
            alt={`изображение курса ${course?.nameRU}`}
            loading="eager"
            style={courseImageCss(course)}
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

            <Button onClick={onAddCourse} disabled={isAdded}>
              {accessToken
                ? isAdded
                  ? 'Курс добавлен'
                  : 'Добавить курс'
                : 'Войдите, чтобы добавить курс'}
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
