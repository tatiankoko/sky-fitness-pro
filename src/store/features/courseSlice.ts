import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';

type courseStateType = {
  currentCourse: CourseType | null;
  allCourses: CourseType[];
  myCourses: CourseType[];
  myCoursesProgress: CourseProgressType[];
  fetchError: null | string;
  fetchIsLoading: boolean;
};

const courseInitialState: courseStateType = {
  currentCourse: null,
  allCourses: [],
  myCourses: [],
  myCoursesProgress: [],
  fetchError: null,
  fetchIsLoading: true,
};

const courseSlice = createSlice({
  name: 'course',
  initialState: courseInitialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<CourseType | null>) => {
      state.currentCourse = action.payload;
    },
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.allCourses = action.payload;
    },
    setMyCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.myCourses = action.payload;
    },
    addMyCourse: (state, action: PayloadAction<CourseType>) => {
      state.myCourses = [...state.myCourses, action.payload];
    },
    removeMyCourse: (state, action: PayloadAction<CourseType>) => {
      state.myCourses = [...state.myCourses].filter(
        (item) => item._id !== action.payload._id,
      );
    },
    addMyCourseProgress: (state, action: PayloadAction<CourseProgressType>) => {
      state.myCoursesProgress = [...state.myCoursesProgress, action.payload];
    },
    /*addCourseProgress: (
      state,
      action: PayloadAction<courseProgressResponseType>,
    ) => {
      const myCourse = state.myCourses.find(
        (course) => course._id === action.payload.courseId,
      );

      console.log('myCourse', myCourse);

      if (!myCourse) return;

      myCourse.courseCompleted = action.payload.courseCompleted;
      myCourse.workoutsProgress = action.payload.workoutsProgress;

      state.myCourses = [
        ...[...state.myCourses].filter(
          (item) => item._id !== action.payload.courseId,
        ),
        myCourse,
      ];
    },*/
    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    },
  },
});

export const {
  setCurrentCourse,
  setAllCourses,
  setMyCourses,
  addMyCourse,
  removeMyCourse,
  addMyCourseProgress,
  setFetchError,
  setFetchIsLoading,
} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
