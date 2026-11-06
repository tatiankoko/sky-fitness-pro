'use client';

import styles from './course.module.css';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { getCourseById } from '@/services/course/courseApi';
import Button from '@/components/button/Button';
import Image from 'next/image';
import classNames from 'classnames';

export default function Course() {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { allCourses, fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.courses,
  );

  interface ColorImagePair {
    key: number;
    value: string;
  }

  const imageColors: ColorImagePair[] = [
    { key: 1, value: '#FFC700' },
    { key: 2, value: '#2491D2' },
    { key: 3, value: '#F7A012' },
    { key: 4, value: '#FF7E65' },
    { key: 5, value: '#7D458C' },
  ];

  const currentCourse = allCourses.find((course) => course._id === params.id);

  const onAddCourse = () => {};

  if (!currentCourse) {
    return <></>;
  }

  return (
    <div className={styles.course__container}>
      <div
        className={styles.header__container}
        style={{
          backgroundColor: imageColors.find(
            (pair) => pair.key === currentCourse.order,
          )?.value,
        }}
      >
        <div className={styles.title__block}>
          <h1 className={styles.title__text}>{currentCourse.nameRU}</h1>
        </div>

        <Image
          width={360}
          height={325}
          src={`/img/course_${currentCourse?.order}.png`}
          alt={`изображение курса ${currentCourse?.nameRU}`}
          loading="eager"
        ></Image>
      </div>

      <div className={styles.fitting__container}>
        <h2 className={styles.block__title}>Подойдет для вас, если:</h2>

        <div className={styles.fitting__block}>
          {currentCourse.fitting.map((item, index) => (
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
          {currentCourse.directions.map((item, index) => (
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

            <Button text={'Добавить курс'} onClick={onAddCourse} />
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
