import styles from './button.module.css';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

type buttonProps = {
  primary?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: ReactNode;
};

export default function Button({
  primary = true,
  disabled = false,
  onClick,
  children,
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
      {children}
    </button>
  );
}
