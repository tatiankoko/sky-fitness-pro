import styles from './workout-progress-modal.module.css';
import Button from '@/components/button/Button';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import { Exercise } from '@/sharedTypes/sharedTypes';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { authUser } from '@/services/auth/authApi';
import { setAccessToken, setUser } from '@/store/features/authSlice';
import { AxiosError } from 'axios';
import { saveExerciseProgress } from '@/services/workout/workoutApi';

interface workoutProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[] | null;
}

export default function WorkoutProgressModal({
  isOpen,
  onClose,
  exercises,
}: workoutProgressModalProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  /*const progressArray: number[] = useCallback(()=>{
    return Array.from({ length: exercises.length }, () => 0);
  }, [exercises]);*/

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    /*setPassword(event.target.value);
    clearErrors();*/
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setErrorMessage('');

    setLoading(true);

    /*saveExerciseProgress({ email, password })
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

            const errorMessage: string = error.response.data.message;

            if (errorMessage.includes('email')) {
              setErrors({ email: true, password: false });
            } else if (errorMessage.includes('пароль')) {
              setErrors({ email: false, password: true });
            } else {
              setErrors({ email: true, password: true });
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
      });*/
  };

  return (
    <WorkoutModal title={'Мой прогресс'} onClose={onClose}>
      <ul className={styles.progress__list}>
        {exercises?.map((exercise) => (
          <li key={exercise._id} className={styles.progress__item}>
            <p
              className={styles.progress__text}
            >{`Сколько раз вы сделали ${exercise.name.toLowerCase()}?`}</p>

            <input
              type="number"
              name="quantity"
              className={styles.progress__input}
              placeholder={'0'}
              onChange={(event) => onChangeInput(event)}
            />
          </li>
        ))}
      </ul>

      <Button onClick={onSubmit}>Сохранить</Button>
    </WorkoutModal>
  );
}
