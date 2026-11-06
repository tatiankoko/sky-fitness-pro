'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/store';
import React, { useState } from 'react';
import styles from './header.module.css';
import Button from '@/components/button/Button';
import { useInitAuth } from '@/hooks/useInitAuth';

export default function Header() {
  useInitAuth();

  const { isAuth, user } = useAppSelector((state) => state.user);
  const [showUser, setShowUser] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

  return (
    <div className={styles.header__container}>
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
              {user?.username || 'username'}
            </a>
            {showUser ? <div /> : null}
          </div>
        ) : (
          <Button text={'Войти'} onClick={onClick} />
        )}
      </div>
    </div>
  );
}
