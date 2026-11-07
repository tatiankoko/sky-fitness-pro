'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/components/signInForm/signin.module.css';
import React, { ChangeEvent, useState } from 'react';
import { registerUser } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@/store/store';
import { setAccessToken } from '@/store/features/authSlice';
import Button from '@/components/button/Button';

export default function SignUpForm({ returnTo }: { returnTo?: string }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    if (password !== confirmPassword) {
      return setErrorMessage('Пароли не совпадают');
    }

    setLoading(true);

    registerUser({ email, password })
      .then((token) => {
        dispatch(setAccessToken(token.token || ''));
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
      <Link href="/main">
        <div className={styles.logo__container}>
          <Image src="/img/logo.png" alt="logo" width={223} height={36} />
        </div>
      </Link>

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
          autoComplete="off"
        />
        <input
          className={styles.form__input}
          type="password"
          name="password"
          placeholder="Повторите пароль"
          onChange={onChangeConfirmPassword}
          autoComplete="off"
        />

        <div className={styles.form__error}>{errorMessage}</div>

        <Button disabled={loading} onClick={onSubmit}>
          Зарегистрироваться
        </Button>

        <Button primary={false} disabled={loading}>
          <Link
            href={
              returnTo
                ? `/main/signin?returnTo=${encodeURIComponent(returnTo)}`
                : '/main/signin'
            }
            className={styles.button__link}
          >
            Войти
          </Link>
        </Button>
      </form>
    </>
  );
}
