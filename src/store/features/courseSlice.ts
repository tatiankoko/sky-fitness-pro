import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseType } from '@/sharedTypes/sharedTypes';

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
  setFetchError,
  setFetchIsLoading,
} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
