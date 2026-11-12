import Skeleton from 'react-loading-skeleton';
import styles from '@/components/courseCard/courseCard.module.css';
import { baseSkeletonColor } from '@/utils/constants';

export default function CourseCardSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Skeleton
        baseColor={baseSkeletonColor}
        width={360}
        height={325}
        borderRadius={30}
      />

      <div className={styles.course__block}>
        <Skeleton
          baseColor={baseSkeletonColor}
          width={300}
          height={35}
          borderRadius={0}
        />

        <div className={styles.course__info}>
          <Skeleton
            baseColor={baseSkeletonColor}
            width={103}
            height={38}
            borderRadius={50}
          />
          <Skeleton
            baseColor={baseSkeletonColor}
            width={163}
            height={38}
            borderRadius={50}
          />
          <Skeleton
            baseColor={baseSkeletonColor}
            width={129}
            height={38}
            borderRadius={50}
          />
        </div>
      </div>
    </div>
  );
}
