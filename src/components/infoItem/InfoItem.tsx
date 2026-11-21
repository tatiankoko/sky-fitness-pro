import styles from './infoItem.module.css';
import { CourseInfo, CourseType } from '@/sharedTypes/sharedTypes';
import {
  capitalize,
  getDailyDurationInMinutesPanel,
  getDurationInDaysPanel,
} from '@/utils/helper';

type infoItemProps = {
  type: CourseInfo;
  course: CourseType;
};

export default function InfoItem({ type, course }: infoItemProps) {
  const infoByType: Record<CourseInfo, { icon: string; text: string }> = {
    [CourseInfo.durationInDays]: {
      icon: 'calendar',
      text: getDurationInDaysPanel(course?.durationInDays),
    },
    [CourseInfo.dailyDurationInMinutes]: {
      icon: 'clock',
      text: getDailyDurationInMinutesPanel(
        course?.dailyDurationInMinutes.from,
        course?.dailyDurationInMinutes.to,
      ),
    },
    [CourseInfo.difficulty]: {
      icon: 'difficulty',
      text: capitalize(course?.difficulty),
    },
  };

  const { icon, text } = infoByType[type];

  return (
    <div className={styles.course__info}>
      <svg className={styles.info__icon}>
        <use xlinkHref={`/img/icon/sprite.svg#icon-${icon}`} />
      </svg>
      <p className={styles.info__text}>{text}</p>
    </div>
  );
}
