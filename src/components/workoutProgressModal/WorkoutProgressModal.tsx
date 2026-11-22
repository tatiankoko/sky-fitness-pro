import styles from './workout-progress-modal.module.css';
import Button from '@/components/button/Button';
import WorkoutModal from '@/components/workoutModal/WorkoutModal';
import { WorkoutType } from '@/sharedTypes/sharedTypes';
import React, { useEffect, useState } from 'react';
import { saveWorkoutProgress } from '@/services/workout/workoutApi';
import { invalidateMyCourses } from '@/store/features/courseSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { toast } from 'react-toastify';
import WorkoutSuccessModal from '@/components/workoutSuccessModal/WorkoutSuccessModal';
import { isInvalidToken } from '@/utils/helper';
import { setLogout } from '@/store/features/authSlice';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useScrollable } from '@/hooks/useScrollable';
import classNames from 'classnames';

interface workoutProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  workout: WorkoutType | null;
  workoutProgress: number[];
  setWorkoutProgress: (workoutProgress: number[]) => void;
  onProgressSaved?: () => void;
}

export default function WorkoutProgressModal({
  isOpen,
  onClose,
  courseId,
  workout,
  workoutProgress,
  setWorkoutProgress,
  onProgressSaved,
}: workoutProgressModalProps) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progressValues, setProgressValues] = useState<number[]>(() =>
    workoutProgress.length > 0
      ? [...workoutProgress]
      : Array.from({ length: workout?.exercises.length || 0 }, () => 0),
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { ref, scrollable } = useScrollable<HTMLUListElement>();

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  if (!isOpen) return null;

  const updateProgressValueAt = (index: number, newValue: number) => {
    if (workout && index < workout.exercises.length && index >= 0) {
      const enteredValue =
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
        dispatch(invalidateMyCourses());
        onProgressSaved?.();
        setShowSuccess(true);
      })
      .catch((error) => {
        if (isInvalidToken(error)) {
          dispatch(setLogout());
        } else {
          setErrorMessage(getApiErrorMessage(error));
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
      {workout?.exercises.length ? (
        <ul
          ref={ref}
          className={classNames(styles.progress__list, {
            [styles.scrollable]: scrollable,
          })}
        >
          {workout.exercises.map((exercise, index) => (
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
                value={progressValues[index] ?? 0}
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
      ) : (
        <p className={styles.progress__notification}>
          Сохраните свой прогресс, если вы выполнили все упражнения тренировки
        </p>
      )}

      <Button onClick={onSubmit} disabled={loading}>
        Сохранить
      </Button>
    </WorkoutModal>
  );
}
