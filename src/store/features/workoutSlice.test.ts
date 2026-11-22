import {
  workoutSliceReducer,
  startWorkoutFetch,
  addWorkout,
  setWorkoutFetchError,
} from './workoutSlice';
import { setAccessToken, setLogout } from './authSlice';
import { CourseWorkoutType } from '@/sharedTypes/sharedTypes';

const workouts = (courseId: string) =>
  ({ courseId, workouts: [] }) as CourseWorkoutType;

const init = () => workoutSliceReducer(undefined, { type: '@@INIT' });

describe('workoutSlice', () => {
  it('начальное состояние пустое', () => {
    const state = init();
    expect(state.allWorkouts).toEqual([]);
    expect(state.fetchIsLoadingByCourse).toEqual({});
    expect(state.fetchErrorByCourse).toEqual({});
  });

  it('startWorkoutFetch ставит loading и сбрасывает ошибку по курсу', () => {
    const state = workoutSliceReducer(
      init(),
      startWorkoutFetch({ courseId: 'c1' }),
    );
    expect(state.fetchIsLoadingByCourse['c1']).toBe(true);
    expect(state.fetchErrorByCourse['c1']).toBeNull();
  });

  it('флаги разных курсов независимы', () => {
    let state = workoutSliceReducer(init(), startWorkoutFetch({ courseId: 'c1' }));
    state = workoutSliceReducer(state, startWorkoutFetch({ courseId: 'c2' }));
    state = workoutSliceReducer(
      state,
      setWorkoutFetchError({ courseId: 'c1', error: 'Ошибка' }),
    );
    expect(state.fetchIsLoadingByCourse['c1']).toBe(false);
    expect(state.fetchErrorByCourse['c1']).toBe('Ошибка');
    expect(state.fetchIsLoadingByCourse['c2']).toBe(true);
    expect(state.fetchErrorByCourse['c2']).toBeNull();
  });

  it('addWorkout добавляет новый курс и снимает флаги', () => {
    let state = workoutSliceReducer(init(), startWorkoutFetch({ courseId: 'c1' }));
    state = workoutSliceReducer(state, addWorkout(workouts('c1')));
    expect(state.allWorkouts).toEqual([workouts('c1')]);
    expect(state.fetchIsLoadingByCourse['c1']).toBe(false);
    expect(state.fetchErrorByCourse['c1']).toBeNull();
  });

  it('повторный addWorkout заменяет запись курса, а не дублирует', () => {
    const updated = { courseId: 'c1', workouts: [{ _id: 'w1' }] };
    let state = workoutSliceReducer(init(), addWorkout(workouts('c1')));
    state = workoutSliceReducer(
      state,
      addWorkout(updated as CourseWorkoutType),
    );
    expect(state.allWorkouts).toHaveLength(1);
    expect(state.allWorkouts[0]).toEqual(updated);
  });

  it('setWorkoutFetchError сохраняет ошибку и снимает loading', () => {
    let state = workoutSliceReducer(init(), startWorkoutFetch({ courseId: 'c1' }));
    state = workoutSliceReducer(
      state,
      setWorkoutFetchError({ courseId: 'c1', error: 'Ошибка сети' }),
    );
    expect(state.fetchErrorByCourse['c1']).toBe('Ошибка сети');
    expect(state.fetchIsLoadingByCourse['c1']).toBe(false);
  });

  it('setAccessToken сбрасывает состояние полностью', () => {
    let state = workoutSliceReducer(init(), addWorkout(workouts('c1')));
    state = workoutSliceReducer(state, startWorkoutFetch({ courseId: 'c2' }));
    state = workoutSliceReducer(state, setAccessToken('token'));
    expect(state).toEqual(init());
  });

  it('setLogout сбрасывает состояние полностью', () => {
    let state = workoutSliceReducer(init(), addWorkout(workouts('c1')));
    state = workoutSliceReducer(state, setLogout());
    expect(state).toEqual(init());
  });
});
