import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseType } from '@/sharedTypes/sharedTypes';

type courseStateType = {
  currentCourse: CourseType | null | undefined;
  allCourses: CourseType[];
  fetchError: null | string;
  fetchIsLoading: boolean;
};

const courseInitialState: courseStateType = {
  currentCourse: null,
  allCourses: [],
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
  setFetchError,
  setFetchIsLoading,
} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
