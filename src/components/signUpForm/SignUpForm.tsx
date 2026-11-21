'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/components/signInForm/signin.module.css';
import { registerUser } from '@/services/auth/authApi';
import Button from '@/components/button/Button';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { useAuthForm } from '@/hooks/useAuthForm';

export default function SignUpForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();

  const signUpHref = returnTo
    ? `/main/signin?returnTo=${encodeURIComponent(returnTo)}`
    : '/main/signin';

  const { errors, errorMessage, loading, onChange, onSubmit } = useAuthForm({
    fields: ['email', 'password', 'confirmPassword'],
    validate: ({ password, confirmPassword }) =>
      password !== confirmPassword
        ? {
            fields: ['password', 'confirmPassword'],
            message: 'Пароли не совпадают',
          }
        : null,
    submit: async ({ email, password }) => {
      await registerUser({ email, password });

      if (returnTo) {
        router.replace(signUpHref);
      } else {
        router.back();
      }
    },
  });

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
          onChange={onChange('email')}
          autoComplete="on"
        />
        <input
          className={classNames(styles.form__input, {
            [styles.input__error]: errors.password,
          })}
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={onChange('password')}
          autoComplete="off"
        />
        <input
          className={classNames(styles.form__input, {
            [styles.input__error]: errors.confirmPassword,
          })}
          type="password"
          name="password"
          placeholder="Повторите пароль"
          onChange={onChange('confirmPassword')}
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
