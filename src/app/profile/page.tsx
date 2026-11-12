'use client';

import styles from './profile.module.css';
import { useRedirectMain } from '@/hooks/useRedirectMain';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import { splitUsername } from '@/utils/helper';
import { setLogout } from '@/store/features/authSlice';
import Link from 'next/link';
import CourseCardSkeleton from '@/components/courseCardSkeleton/CourseCardSkeleton';
import CourseCard from '@/components/courseCard/CourseCard';
import { useFetchMyCourses } from '@/hooks/useFetchMyCourses';
import { useFetchCourses } from '@/hooks/useFetchCourses';
import WorkoutSelectionModal from '@/components/workoutSelectionModal/WorkoutSelectionModal';
import { toast } from 'react-toastify';
import { CourseType } from '@/sharedTypes/sharedTypes';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { myCourses, fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.courses,
  );
  const [showSelection, setShowSelection] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);

  useRedirectMain();
  useFetchCourses();
  const { isLoading, errorMsg } = useFetchMyCourses();

  useEffect(() => {
    if (fetchError || errorMsg) toast.error(errorMsg || fetchError);
  }, [fetchError, errorMsg]);

  const onWorkoutSelectionChange = useCallback(
    (selectedCourse: CourseType) => {
      /*useFetchWorkouts(selectedCourse._id);*/
      setSelectedCourse(selectedCourse);
      setShowSelection(true);
    },
    [showSelection, selectedCourse],
  );

  const onCloseWorkoutSelection = () => {
    setShowSelection(!showSelection);
    setSelectedCourse(null);
  };

  const logout = () => {
    dispatch(setLogout());
  };

  return (
    <div className={styles.profile__container}>
      <section className={styles.user__block}>
        <h1 className={styles.title}>Профиль</h1>

        <div className={styles.user__info}>
          <svg className={styles.user__icon}>
            <use xlinkHref="/img/icon/sprite.svg#icon-profile"></use>
          </svg>

          <div className={styles.user__content}>
            <h2 className={styles.user__name}>
              {splitUsername(user?.email || 'Username')}
            </h2>
            <p className={styles.user__login}>{`Логин: ${user?.email}`}</p>

            <Link href="/main">
              <Button primary={false} onClick={logout}>
                Выйти
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.courses__block}>
        <h1 className={styles.title}>Мои курсы</h1>

        {fetchIsLoading || isLoading || myCourses.length > 0 ? null : (
          <div className={styles.courses__notification}>
            Пока нет приобретенных курсов
          </div>
        )}

        <div className={styles.courses__content}>
          {fetchIsLoading || isLoading ? (
            <>
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </>
          ) : (
            myCourses.map((item) => (
              <CourseCard
                key={item._id}
                course={item}
                isAdded={true}
                showUserContent={true}
                onWorkoutAction={() => onWorkoutSelectionChange(item)}
              />
            ))
          )}
        </div>

        <WorkoutSelectionModal
          isOpen={showSelection}
          course={selectedCourse}
          onClose={() => onCloseWorkoutSelection()}
        />
      </section>
    </div>
  );
}
