'use client';

import styles from './profile.module.css';
import { useRedirectMain } from '@/hooks/useRedirectMain';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react';
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

export default function Profile() {
  useRedirectMain();
  useFetchCourses();
  const { isLoading, errorMsg } = useFetchMyCourses();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { myCourses, fetchIsLoading, fetchError } = useAppSelector(
    (state) => state.courses,
  );
  const [showSelection, setShowSelection] = useState<boolean>(false);

  useEffect(() => {
    if (fetchError || errorMsg) toast.error(errorMsg || fetchError);
  }, [fetchError, errorMsg]);

  const logout = () => {
    dispatch(setLogout());
  };

  const onCourseCardClick = (): void => {};

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
                onClickAction={onCourseCardClick}
                onWorkoutAction={() => setShowSelection(true)}
              />
            ))
          )}

          <WorkoutSelectionModal
            isOpen={showSelection}
            onClose={() => setShowSelection(!showSelection)}
          />
        </div>
      </section>
    </div>
  );
}
