import {
  courseSliceReducer,
  setAllCourses,
  startCoursesFetch,
  setCoursesFetchError,
  startMyCoursesFetch,
  setMyCoursesResponse,
  setMyCoursesFetchError,
  addMyCourse,
  removeMyCourse,
  invalidateMyCourses,
} from './courseSlice';
import { setAccessToken, setLogout } from './authSlice';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { MyCoursesResponseType } from '@/services/course/courseApi';

const course = (id: string, order = 1) =>
  ({ _id: id, order, nameRU: `Курс ${id}` }) as CourseType;

const c1 = course('c1');
const c2 = course('c2');

const init = () => courseSliceReducer(undefined, { type: '@@INIT' });

describe('courseSlice', () => {
  it('начальное состояние пустое', () => {
    const state = init();
    expect(state.allCourses).toEqual([]);
    expect(state.myCourses).toEqual([]);
    expect(state.selectedCourseIds).toEqual([]);
    expect(state.myCoursesRequested).toBe(false);
  });

  describe('загрузка всех курсов', () => {
    it('startCoursesFetch ставит loading и сбрасывает ошибку', () => {
      const state = courseSliceReducer(
        { ...init(), fetchAllCoursesError: 'старая ошибка' },
        startCoursesFetch(),
      );
      expect(state.fetchAllCoursesIsLoading).toBe(true);
      expect(state.fetchAllCoursesError).toBeNull();
    });

    it('setAllCourses сохраняет курсы и снимает loading', () => {
      const state = courseSliceReducer(init(), setAllCourses([c1, c2]));
      expect(state.allCourses).toEqual([c1, c2]);
      expect(state.fetchAllCoursesIsLoading).toBe(false);
    });

    it('setCoursesFetchError сохраняет ошибку и снимает loading', () => {
      const state = courseSliceReducer(
        { ...init(), fetchAllCoursesIsLoading: true },
        setCoursesFetchError('Ошибка сети'),
      );
      expect(state.fetchAllCoursesError).toBe('Ошибка сети');
      expect(state.fetchAllCoursesIsLoading).toBe(false);
    });
  });

  describe('синхронизация myCourses и selectedCourseIds', () => {
    it('setAllCourses фильтрует myCourses по уже выбранным id', () => {
      let state = courseSliceReducer(init(), addMyCourse(c1));
      state = courseSliceReducer(state, setAllCourses([c1, c2]));
      expect(state.myCourses).toEqual([c1]);
    });

    it('hard refresh: ids пришли раньше allCourses — myCourses заполняется после загрузки курсов', () => {
      let state = courseSliceReducer(
        init(),
        setMyCoursesResponse({
          selectedCourses: ['c2'],
          courseProgress: [],
        }),
      );
      expect(state.myCourses).toEqual([]);

      state = courseSliceReducer(state, setAllCourses([c1, c2]));
      expect(state.myCourses).toEqual([c2]);
    });

    it('setMyCoursesResponse сохраняет ids и прогресс, ставит requested', () => {
      const progress = { courseId: 'c1', courseCompleted: false };
      const state = courseSliceReducer(
        init(),
        setMyCoursesResponse({
          selectedCourses: ['c1'],
          courseProgress: [progress],
        } as MyCoursesResponseType),
      );
      expect(state.selectedCourseIds).toEqual(['c1']);
      expect(state.myCoursesProgress).toEqual([progress]);
      expect(state.myCoursesRequested).toBe(true);
      expect(state.fetchMyCoursesIsLoading).toBe(false);
    });

    it('setMyCoursesResponse терпит отсутствующие поля ответа', () => {
      const state = courseSliceReducer(
        init(),
        setMyCoursesResponse({} as MyCoursesResponseType),
      );
      expect(state.selectedCourseIds).toEqual([]);
      expect(state.myCoursesProgress).toEqual([]);
    });
  });

  describe('addMyCourse / removeMyCourse', () => {
    it('addMyCourse добавляет курс и id', () => {
      const state = courseSliceReducer(init(), addMyCourse(c1));
      expect(state.myCourses).toEqual([c1]);
      expect(state.selectedCourseIds).toEqual(['c1']);
    });

    it('повторный addMyCourse не создаёт дублей', () => {
      let state = courseSliceReducer(init(), addMyCourse(c1));
      state = courseSliceReducer(state, addMyCourse(c1));
      expect(state.myCourses).toEqual([c1]);
      expect(state.selectedCourseIds).toEqual(['c1']);
    });

    it('removeMyCourse убирает курс и id', () => {
      let state = courseSliceReducer(init(), addMyCourse(c1));
      state = courseSliceReducer(state, addMyCourse(c2));
      state = courseSliceReducer(state, removeMyCourse(c1));
      expect(state.myCourses).toEqual([c2]);
      expect(state.selectedCourseIds).toEqual(['c2']);
    });

    it('removeMyCourse несуществующего курса ничего не меняет', () => {
      const state = courseSliceReducer(init(), removeMyCourse(c1));
      expect(state.myCourses).toEqual([]);
      expect(state.selectedCourseIds).toEqual([]);
    });
  });

  describe('загрузка моих курсов', () => {
    it('startMyCoursesFetch / setMyCoursesFetchError управляют флагами', () => {
      let state = courseSliceReducer(init(), startMyCoursesFetch());
      expect(state.fetchMyCoursesIsLoading).toBe(true);

      state = courseSliceReducer(state, setMyCoursesFetchError('Ошибка'));
      expect(state.fetchMyCoursesIsLoading).toBe(false);
      expect(state.fetchMyCoursesError).toBe('Ошибка');
    });

    it('invalidateMyCourses сбрасывает requested, сохраняя данные', () => {
      let state = courseSliceReducer(init(), addMyCourse(c1));
      state = courseSliceReducer(
        state,
        setMyCoursesResponse({
          selectedCourses: ['c1'],
          courseProgress: [],
        }),
      );
      state = courseSliceReducer(state, invalidateMyCourses());
      expect(state.myCoursesRequested).toBe(false);
      expect(state.fetchMyCoursesIsLoading).toBe(false);
      expect(state.selectedCourseIds).toEqual(['c1']);
    });
  });

  describe('auth-события', () => {
    const populated = () => {
      let state = courseSliceReducer(init(), setAllCourses([c1, c2]));
      state = courseSliceReducer(state, addMyCourse(c1));
      return state;
    };

    it('setAccessToken очищает мои курсы, но сохраняет allCourses', () => {
      const state = courseSliceReducer(populated(), setAccessToken('token'));
      expect(state.myCourses).toEqual([]);
      expect(state.selectedCourseIds).toEqual([]);
      expect(state.myCoursesProgress).toEqual([]);
      expect(state.myCoursesRequested).toBe(false);
      expect(state.allCourses).toEqual([c1, c2]);
    });

    it('setLogout очищает мои курсы, но сохраняет allCourses', () => {
      const state = courseSliceReducer(populated(), setLogout());
      expect(state.myCourses).toEqual([]);
      expect(state.selectedCourseIds).toEqual([]);
      expect(state.myCoursesRequested).toBe(false);
      expect(state.allCourses).toEqual([c1, c2]);
    });
  });
});
