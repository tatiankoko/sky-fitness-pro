'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/store';
import React, { useState } from 'react';
import styles from './header.module.css';
import Button from '@/components/button/Button';
import { useInitAuth } from '@/hooks/useInitAuth';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

export default function Header() {
  useInitAuth();

  const { isAuth, user } = useAppSelector((state) => state.user);
  const [showUser, setShowUser] = useState(false);
  const pathname = usePathname();
  const returnTo =
    pathname === '/main' || /^\/main\/course\/[^/]+$/.test(pathname)
      ? pathname
      : null;
  const signInHref = returnTo
    ? `/main/signin?returnTo=${encodeURIComponent(returnTo)}`
    : '/main/signin';

  return (
    <div className={classNames(styles.header__container, styles.center)}>
      <Link href="/">
        <Image
          src="/img/logo.png"
          alt="logo"
          width={223}
          height={36}
          loading="eager"
        />
      </Link>
      <div className={styles.auth__block}>
        {isAuth ? (
          <div className={styles.user__block}>
            <svg className={styles.user__icon}>
              <use xlinkHref="/img/icon/sprite.svg#icon-profile"></use>
            </svg>
            <a
              className={styles.user__name}
              onClick={() => setShowUser(!showUser)}
            >
              {user?.email || 'username'}
            </a>
            {showUser ? <div /> : null}
          </div>
        ) : (
          <Link href={signInHref}>
            <Button>Войти</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
