'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal/Modal';
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
    <Modal
      overlayClassName={styles.overlay}
      dialogClassName={styles.dialog}
      onClose={close}
      ariaLabel={title}
    >
      {children}
    </Modal>
  );
}
