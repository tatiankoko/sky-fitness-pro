import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';
import { MyCoursesResponseType } from '@/services/course/courseApi';
import { setAccessToken, setLogout } from '@/store/features/authSlice';

type courseStateType = {
  allCourses: CourseType[];
  myCourses: CourseType[];
  selectedCourseIds: string[];
  myCoursesProgress: CourseProgressType[];
  myCoursesRequested: boolean;
  fetchMyCoursesIsLoading: boolean;
  fetchMyCoursesError: string | null;
  fetchAllCoursesError: null | string;
  fetchAllCoursesIsLoading: boolean;
};

const initialState: courseStateType = {
  allCourses: [],
  myCourses: [],
  selectedCourseIds: [],
  myCoursesProgress: [],
  myCoursesRequested: false,
  fetchMyCoursesIsLoading: false,
  fetchMyCoursesError: null,
  fetchAllCoursesError: null,
  fetchAllCoursesIsLoading: false,
};

const syncMyCourses = (state: courseStateType) => {
  const selectedIds = new Set(state.selectedCourseIds);
  state.myCourses = state.allCourses.filter((course) =>
    selectedIds.has(course._id),
  );
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    startCoursesFetch: (state) => {
      state.fetchAllCoursesIsLoading = true;
      state.fetchAllCoursesError = null;
    },
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.allCourses = action.payload;
      state.fetchAllCoursesIsLoading = false;
      state.fetchAllCoursesError = null;
      syncMyCourses(state);
    },
    setCoursesFetchError: (state, action: PayloadAction<string>) => {
      state.fetchAllCoursesIsLoading = false;
      state.fetchAllCoursesError = action.payload;
    },
    startMyCoursesFetch: (state) => {
      state.fetchMyCoursesIsLoading = true;
      state.fetchMyCoursesError = null;
    },
    setMyCoursesResponse: (
      state,
      action: PayloadAction<MyCoursesResponseType>,
    ) => {
      state.fetchMyCoursesIsLoading = false;
      state.fetchMyCoursesError = null;
      state.myCoursesRequested = true;
      state.selectedCourseIds = action.payload.selectedCourses ?? [];
      state.myCoursesProgress = action.payload.courseProgress ?? [];
      syncMyCourses(state);
    },
    setMyCoursesFetchError: (state, action: PayloadAction<string>) => {
      state.fetchMyCoursesIsLoading = false;
      state.fetchMyCoursesError = action.payload;
    },
    addMyCourse: (state, action: PayloadAction<CourseType>) => {
      if (
        !state.myCourses.some((course) => course._id === action.payload._id)
      ) {
        state.myCourses.push(action.payload);
      }
      if (!state.selectedCourseIds.includes(action.payload._id)) {
        state.selectedCourseIds.push(action.payload._id);
      }
    },
    removeMyCourse: (state, action: PayloadAction<CourseType>) => {
      state.myCourses = state.myCourses.filter(
        (course) => course._id !== action.payload._id,
      );
      state.selectedCourseIds = state.selectedCourseIds.filter(
        (id) => id !== action.payload._id,
      );
    },
    invalidateMyCourses: (state) => {
      // todo check
      state.myCoursesRequested = false;
      state.fetchMyCoursesIsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAccessToken, (state) => {
        state.myCourses = [];
        state.selectedCourseIds = [];
        state.myCoursesProgress = [];
        state.myCoursesRequested = false;
        state.fetchMyCoursesIsLoading = false;
        state.fetchMyCoursesError = null;
      })
      .addCase(setLogout, (state) => {
        state.myCourses = [];
        state.selectedCourseIds = [];
        state.myCoursesProgress = [];
        state.myCoursesRequested = false;
        state.fetchMyCoursesIsLoading = false;
        state.fetchMyCoursesError = null;
      });
  },
});

export const {
  setAllCourses,
  startCoursesFetch,
  setCoursesFetchError,
  startMyCoursesFetch,
  setMyCoursesResponse,
  setMyCoursesFetchError,
  /*setMyCourses,*/
  addMyCourse,
  removeMyCourse,
  invalidateMyCourses,
} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
