import styles from './workout-progress-modal.module.css';
import Button from '@/components/button/Button';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import { WorkoutType } from '@/sharedTypes/sharedTypes';
import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { saveWorkoutProgress } from '@/services/workout/workoutApi';
import { useAppSelector } from '@/store/store';
import { toast } from 'react-toastify';
import WorkoutSuccessModal from '@/components/workoutSuccessModal/WorkoutSuccessModal';

interface workoutProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  workout: WorkoutType | null;
  workoutProgress: number[];
  setWorkoutProgress: (workoutProgress: number[]) => void;
}

export default function WorkoutProgressModal({
  isOpen,
  onClose,
  courseId,
  workout,
  workoutProgress,
  setWorkoutProgress,
}: workoutProgressModalProps) {
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progressValues, setProgressValues] = useState<number[]>(() =>
    Array.from({ length: workout?.exercises.length || 0 }, () => 0),
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (workoutProgress.length > 0) {
      setProgressValues(workoutProgress || []);
    }
  }, [workoutProgress]);

  if (!isOpen) return null;

  const updateProgressValueAt = (index: number, newValue: number) => {
    if (workout && index < workout.exercises.length && index >= 0) {
      let enteredValue =
        newValue > workout.exercises[index].quantity
          ? workout.exercises[index].quantity
          : newValue;

      setProgressValues((prev) => {
        const next = [...prev];
        next[index] = enteredValue;
        return next;
      });
    }
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setErrorMessage('');
    setLoading(true);

    saveWorkoutProgress({
      access: accessToken || '',
      courseId: courseId,
      workoutId: workout?._id || '',
      progressData: progressValues,
    })
      .then(() => {
        setWorkoutProgress(progressValues);
        setShowSuccess(true);
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

  return showSuccess ? (
    <WorkoutSuccessModal isOpen={showSuccess} onClose={onClose} />
  ) : (
    <WorkoutModal title={'Мой прогресс'} onClose={onClose}>
      <ul className={styles.progress__list}>
        {workout?.exercises.map((exercise, index) => (
          <li key={exercise._id} className={styles.progress__item}>
            <p
              className={styles.progress__text}
            >{`Сколько раз вы сделали ${exercise.name.toLowerCase()}?`}</p>

            <input
              type="text"
              inputMode="numeric" // Открывает цифровую клавиатуру на смартфонах
              pattern="[0-9]*"
              name="quantity"
              min={0}
              max={exercise.quantity}
              value={progressValues[index]}
              className={styles.progress__input}
              placeholder={'0'}
              onChange={(e) =>
                updateProgressValueAt(
                  index,
                  Number(e.target.value.replace(/\D/g, '')) || 0,
                )
              }
            />
          </li>
        ))}
      </ul>

      <Button onClick={onSubmit} disabled={loading}>
        Сохранить
      </Button>
    </WorkoutModal>
  );
}
