import styles from './button.module.css';
import classNames from 'classnames';

type buttonProps = {
  text: string;
  primary?: boolean;
};

export default function Button({ text, primary = true }: buttonProps) {
  return (
    <button
      className={classNames(styles.button__primary, {
        [styles.button__secondary]: !primary,
      })}
    >
      {text}
    </button>
  );
}
