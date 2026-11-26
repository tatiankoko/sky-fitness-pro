import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { setAccessToken } from '@/store/features/authSlice';
import { setMyCoursesResponse } from '@/store/features/courseSlice';
import CourseProgressContent from './CourseProgressContent';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';
import { resetCourseProgress } from '@/services/course/courseApi';

jest.mock('@/services/course/courseApi', () => ({
  resetCourseProgress: jest.fn(),
}));

const mockReset = resetCourseProgress as jest.Mock;

const course = {
  _id: 'c1',
  nameRU: 'Йога',
  workouts: [{ _id: 'w1' }, { _id: 'w2' }],
} as unknown as CourseType;

const setup = (
  courseProgress?: CourseProgressType,
  onWorkoutAction = jest.fn(),
  isActionLoading = false,
) => {
  const store = makeStore();
  store.dispatch(setAccessToken('token'));
  store.dispatch(
    setMyCoursesResponse({ selectedCourses: [], courseProgress: [] }),
  );
  const utils = render(
    <Provider store={store}>
      <CourseProgressContent
        course={course}
        courseProgress={courseProgress}
        isActionLoading={isActionLoading}
        onWorkoutAction={onWorkoutAction}
      />
    </Provider>,
  );
  return { store, onWorkoutAction, ...utils };
};

beforeEach(() => {
  mockReset.mockReset();
  mockReset.mockResolvedValue(undefined);
});

describe('CourseProgressContent', () => {
  it('без прогресса — «Начать тренировки», клик открывает модалку', () => {
    const { onWorkoutAction } = setup();
    const button = screen.getByRole('button', { name: 'Начать тренировки' });
    fireEvent.click(button);
    expect(onWorkoutAction).toHaveBeenCalledTimes(1);
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('частичный прогресс — «Продолжить», клик открывает модалку', () => {
    const { onWorkoutAction } = setup({
      courseId: 'c1',
      courseCompleted: false,
      workoutsProgress: [
        { workoutCompleted: true },
        { workoutCompleted: false },
      ],
    } as CourseProgressType);
    const button = screen.getByRole('button', { name: 'Продолжить' });
    fireEvent.click(button);
    expect(onWorkoutAction).toHaveBeenCalledTimes(1);
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('завершённый курс — «Начать заново», клик сбрасывает прогресс', async () => {
    const { store, onWorkoutAction } = setup({
      courseId: 'c1',
      courseCompleted: true,
      workoutsProgress: [],
    } as CourseProgressType);
    expect(store.getState().courses.myCoursesRequested).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Начать заново' }));

    await waitFor(() => expect(mockReset).toHaveBeenCalledWith('token', 'c1'));
    expect(onWorkoutAction).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(store.getState().courses.myCoursesRequested).toBe(false),
    );
  });

  it('isActionLoading блокирует кнопку', () => {
    setup(undefined, jest.fn(), true);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
