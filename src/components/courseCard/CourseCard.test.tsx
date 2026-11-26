import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { setAccessToken } from '@/store/features/authSlice';
import CourseCard from './CourseCard';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { addCourse } from '@/services/course/courseApi';
import { toast } from 'react-toastify';

jest.mock('@/services/course/courseApi', () => ({
  addCourse: jest.fn(),
  removeCourse: jest.fn(),
  resetCourseProgress: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

const mockAdd = addCourse as jest.Mock;

const course = {
  _id: 'c1',
  order: 1,
  nameRU: 'Йога',
  durationInDays: 30,
  dailyDurationInMinutes: { from: 15, to: 30 },
  difficulty: 'начальный',
  workouts: [],
} as unknown as CourseType;

const setup = (
  props: Partial<Parameters<typeof CourseCard>[0]> = {},
  authenticated = false,
) => {
  const store = makeStore();
  if (authenticated) store.dispatch(setAccessToken('token'));
  const utils = render(
    <Provider store={store}>
      <CourseCard course={course} {...props} />
    </Provider>,
  );
  return { store, ...utils };
};

const icon = (container: HTMLElement) =>
  container.querySelector('.image__button') as Element;

beforeEach(() => {
  mockAdd.mockReset();
  (toast.info as jest.Mock).mockReset();
  (toast.success as jest.Mock).mockReset();
});

describe('CourseCard', () => {
  it('без showUserContent карточка кликабельна (wrapper_clickable)', () => {
    const { container } = setup();
    expect(container.querySelector('.wrapper')).toHaveClass(
      'wrapper_clickable',
    );
  });

  it('с showUserContent курсор обычный (класса нет)', () => {
    const { container } = setup({ showUserContent: true });
    expect(container.querySelector('.wrapper')).not.toHaveClass(
      'wrapper_clickable',
    );
  });

  it('клик по иконке не всплывает на карточку', () => {
    const onClickAction = jest.fn();
    const { container } = setup({ onClickAction });
    fireEvent.click(icon(container));
    expect(onClickAction).not.toHaveBeenCalled();
  });

  it('без авторизации клик по иконке показывает подсказку, а не запрос', () => {
    const { container } = setup();
    fireEvent.click(icon(container));
    expect(toast.info).toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('с авторизацией клик по иконке добавляет курс', async () => {
    mockAdd.mockResolvedValue({});
    const { store, container } = setup({}, true);
    fireEvent.click(icon(container));
    await waitFor(() =>
      expect(store.getState().courses.selectedCourseIds).toContain('c1'),
    );
    expect(mockAdd).toHaveBeenCalledWith('token', 'c1');
    expect(toast.success).toHaveBeenCalled();
  });

  it('повторный клик во время запроса не дублирует addCourse', () => {
    mockAdd.mockReturnValue(new Promise(() => {}));
    const { container } = setup({}, true);
    fireEvent.click(icon(container));
    fireEvent.click(icon(container));
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('текст tooltip зависит от isAdded', () => {
    const { container, unmount } = setup();
    expect(icon(container)).toHaveAttribute(
      'data-tooltip-content',
      'Добавить курс',
    );
    unmount();

    const added = setup({ isAdded: true });
    expect(icon(added.container)).toHaveAttribute(
      'data-tooltip-content',
      'Удалить курс',
    );
  });
});
