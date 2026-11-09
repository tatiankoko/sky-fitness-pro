import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { courseProgressResponseType } from '@/services/course/courseApi';

type courseStateType = {
  currentCourse: CourseType | null | undefined;
  allCourses: CourseType[];
  myCourses: CourseType[];
  fetchError: null | string;
  fetchIsLoading: boolean;
};

const courseInitialState: courseStateType = {
  currentCourse: null,
  allCourses: [],
  myCourses: [],
  fetchError: null,
  fetchIsLoading: true,
};

const courseSlice = createSlice({
  name: 'course',
  initialState: courseInitialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<CourseType>) => {
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
    addCourseProgress: (
      state,
      action: PayloadAction<courseProgressResponseType>,
    ) => {
      const myCourse = state.myCourses.find(
        (course) => course._id === action.payload._id,
      );

      if (!myCourse) return;

      myCourse.courseCompleted = action.payload.courseCompleted;
      myCourse.workoutsProgress = action.payload.workoutsProgress;

      state.myCourses = [
        ...[...state.myCourses].filter(
          (item) => item._id !== action.payload._id,
        ),
        myCourse,
      ];
    },
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
  addCourseProgress,
  setFetchError,
  setFetchIsLoading,
} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
