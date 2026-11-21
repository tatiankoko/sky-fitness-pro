'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './signin.module.css';
import { authUser } from '@/services/auth/authApi';
import { useAppDispatch } from '@/store/store';
import { setAccessToken, setIsAuth, setUser } from '@/store/features/authSlice';
import Button from '@/components/button/Button';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { useAuthForm } from '@/hooks/useAuthForm';

export default function SignInForm({ returnTo }: { returnTo?: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { errors, errorMessage, loading, onChange, onSubmit } = useAuthForm({
    fields: ['email', 'password'],
    submit: async ({ email, password }) => {
      const token = await authUser({ email, password });

      dispatch(setUser({ email: email, password: password }));
      dispatch(setAccessToken(token.token || ''));
      dispatch(setIsAuth());

      if (returnTo) {
        router.replace(returnTo);
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
          placeholder="Логин"
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
