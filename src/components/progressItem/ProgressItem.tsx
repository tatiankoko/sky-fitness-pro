import styles from './progress-item.module.css';

interface progressItemProps {
  title: string;
  progress: number;
  max: number;
}

export default function ProgressItem({
  title,
  progress = 0,
  max = 100,
}: progressItemProps) {
  const percent = () => {
    return max > 0 ? Math.round((progress * 100) / max) : 0;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{`${title} ${percent()}%`}</h3>

      <progress
        className={styles.indicator}
        value={progress}
        max={max}
      ></progress>
    </div>
  );
}
