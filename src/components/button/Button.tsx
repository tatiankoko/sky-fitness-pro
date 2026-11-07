import styles from './button.module.css';
import classNames from 'classnames';
import React from 'react';

type buttonProps = {
  text: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Button({
  text,
  primary = true,
  disabled = false,
  onClick,
}: buttonProps) {
  return (
    <button
      className={classNames(styles.button__primary, {
        [styles.button__secondary]: !primary,
      })}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
