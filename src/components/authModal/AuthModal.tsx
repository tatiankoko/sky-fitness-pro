'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth-modal.module.css';

interface AuthModalProps {
  children: ReactNode;
  title: string;
  returnTo?: string;
}

export default function AuthModal({
  children,
  title,
  returnTo,
}: AuthModalProps) {
  const router = useRouter();

  const close = () => {
    if (returnTo) {
      router.replace(returnTo);
      return;
    }

    router.back();
  };

  return (
    <div className={styles.overlay} onClick={close}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.close}
          type="button"
          aria-label="Закрыть окно"
          onClick={close}
        >
          ×
        </button>
        {children}
      </section>
    </div>
  );
}
