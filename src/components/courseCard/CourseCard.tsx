import styles from './courseCard.module.css';
import Image from 'next/image';
import { CourseInfo, CourseType } from '@/sharedTypes/sharedTypes';
import InfoItem from '@/components/infoItem/InfoItem';
import React from 'react';

type CourseCardProps = {
  course: CourseType;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.image__block}>
        <Image
          width={360}
          height={325}
          src={`/img/course_${course?.order}.png`}
          alt={`изображение курса ${course?.nameRU}`}
          loading="eager"
        ></Image>
        <svg className={styles.image__button}>
          <use xlinkHref="/img/icon/sprite.svg#icon-add"></use>
        </svg>
      </div>

      <div className={styles.course__block}>
        <h2 className={styles.course__title}>{course?.nameRU}</h2>

        <div className={styles.course__info}>
          <InfoItem type={CourseInfo.durationInDays} course={course} />
          <InfoItem type={CourseInfo.dailyDurationInMinutes} course={course} />
          <InfoItem type={CourseInfo.difficulty} course={course} />
        </div>
      </div>

      <div className={styles.progress__block}>
        <h3 className={styles.progress__title}></h3>
        <progress className={styles.progress__indicator}></progress>
      </div>
    </div>
  );
}
