'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './signin.module.css';
import React, { ChangeEvent, useState } from 'react';
import { authUser } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@/store/store';
import { setAccessToken, setUser } from '@/store/features/authSlice';
import Button from '@/components/button/Button';
import { useRouter } from 'next/navigation';

export default function SignInForm({ returnTo }: { returnTo?: string }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    setLoading(true);

    authUser({ email, password })
      .then((token) => {
        dispatch(setUser({ email: email, password: password }));
        dispatch(setAccessToken(token.token || ''));

        if (returnTo) {
          router.replace(returnTo);
        } else {
          router.back();
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else if (error.request) {
            setErrorMessage('Произошла ошибка. Попробуйте позже');
          } else {
            setErrorMessage('Неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={styles.logo__container}>
        <Image src="/img/logo.png" alt="logo" width={223} height={36} />
      </div>

      <form className={styles.form}>
        <input
          className={styles.form__input}
          type="text"
          name="login"
          placeholder="Почта"
          onChange={onChangeEmail}
          autoComplete="on"
        />
        <input
          className={styles.form__input}
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={onChangePassword}
          autoComplete="on"
        />

        <div className={styles.form__error}>{errorMessage}</div>

        <Button disabled={loading} onClick={onSubmit}>
          Войти
        </Button>

        <Button primary={false} disabled={loading}>
          <Link
            href={
              returnTo
                ? `/main/signup?returnTo=${encodeURIComponent(returnTo)}`
                : '/main/signup'
            }
            className={styles.button__link}
          >
            Зарегистрироваться
          </Link>
        </Button>
      </form>
    </>
  );
}
