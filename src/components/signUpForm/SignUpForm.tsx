'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/components/signInForm/signin.module.css';
import React, { ChangeEvent, useState } from 'react';
import { registerUser } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import Button from '@/components/button/Button';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

export default function SignUpForm({ returnTo }: { returnTo?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const signUpHref = returnTo
    ? `/main/signin?returnTo=${encodeURIComponent(returnTo)}`
    : '/main/signin';

  const clearErrors = () => {
    setErrors({ email: false, password: false, confirmPassword: false });
  };

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    clearErrors();
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    clearErrors();
  };

  const onChangeConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    clearErrors();
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setErrorMessage('');
    clearErrors();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrors({
        email: !email.trim(),
        password: !password.trim(),
        confirmPassword: !confirmPassword.trim(),
      });
      return setErrorMessage('Заполните все поля');
    }

    if (password !== confirmPassword) {
      setErrors({
        email: false,
        password: true,
        confirmPassword: true,
      });
      return setErrorMessage('Пароли не совпадают');
    }

    setLoading(true);

    registerUser({ email, password })
      .then(() => {
        if (returnTo) {
          router.replace(signUpHref);
        } else {
          router.back();
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMessage(error.response.data.message);

            const errorMessage: string = error.response.data.message;

            if (errorMessage.includes('email')) {
              setErrors({
                email: true,
                password: false,
                confirmPassword: false,
              });
            } else if (errorMessage.includes('пароль')) {
              setErrors({
                email: false,
                password: true,
                confirmPassword: false,
              });
            } else if (errorMessage.includes('пароли')) {
              setErrors({
                email: false,
                password: false,
                confirmPassword: true,
              });
            } else {
              setErrors({ email: true, password: true, confirmPassword: true });
            }
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
          className={classNames(styles.form__input, {
            [styles.input__error]: errors.email,
          })}
          type="text"
          name="login"
          placeholder="Эл. почта"
          onChange={onChangeEmail}
          autoComplete="on"
        />
        <input
          className={classNames(styles.form__input, {
            [styles.input__error]: errors.password,
          })}
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={onChangePassword}
          autoComplete="off"
        />
        <input
          className={classNames(styles.form__input, {
            [styles.input__error]: errors.confirmPassword,
          })}
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
          <Link href={signUpHref} className={styles.button__link}>
            Войти
          </Link>
        </Button>
      </form>
    </>
  );
}
