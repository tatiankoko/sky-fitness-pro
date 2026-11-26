'use client';

import { ReactNode } from 'react';

interface ModalProps {
  overlayClassName: string;
  dialogClassName: string;
  onClose: () => void;
  ariaLabel?: string;
  children: ReactNode;
}

export default function Modal({
  overlayClassName,
  dialogClassName,
  onClose,
  ariaLabel,
  children,
}: ModalProps) {
  return (
    <div className={overlayClassName} onClick={onClose}>
      <div
        className={dialogClassName}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
