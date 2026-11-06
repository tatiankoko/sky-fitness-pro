import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '@/components/courseCard/courseCard.module.css';

export default function CourseCardSkeleton() {
  const colorBase = '#C8C8C8';

  return (
    <div className={styles.wrapper}>
      <Skeleton
        baseColor={colorBase}
        width={360}
        height={325}
        borderRadius={30}
      />

      <div className={styles.course__block}>
        <Skeleton
          baseColor={colorBase}
          width={300}
          height={35}
          borderRadius={0}
        />

        <div className={styles.course__info}>
          <Skeleton
            baseColor={colorBase}
            width={103}
            height={38}
            borderRadius={50}
          />
          <Skeleton
            baseColor={colorBase}
            width={163}
            height={38}
            borderRadius={50}
          />
          <Skeleton
            baseColor={colorBase}
            width={129}
            height={38}
            borderRadius={50}
          />
        </div>
      </div>
    </div>
  );
}
