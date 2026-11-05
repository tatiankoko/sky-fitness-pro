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
  const icon =
    type === CourseInfo.durationInDays
      ? 'calendar'
      : type === CourseInfo.dailyDurationInMinutes
        ? 'clock'
        : 'difficulty';

  const text =
    type === CourseInfo.durationInDays
      ? getDurationInDaysPanel(course?.durationInDays)
      : type === CourseInfo.dailyDurationInMinutes
        ? getDailyDurationInMinutesPanel(
            course?.dailyDurationInMinutes.from,
            course?.dailyDurationInMinutes.to,
          )
        : capitalize(course?.difficulty);

  return (
    <div className={styles.course__info}>
      <svg className={styles.info__icon}>
        <use xlinkHref={`/img/icon/sprite.svg#icon-${icon}`} />
      </svg>
      <p className={styles.info__text}>{text}</p>
    </div>
  );
}
