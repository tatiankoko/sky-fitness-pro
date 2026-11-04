import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface courseState {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  workouts: string[];
}

interface courseStateId extends courseState {
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
}

const courseInitialState: courseState = {
  _id: '',
  nameRU: '',
  nameEN: '',
  description: '',
  directions: [],
  fitting: [],
  workouts: [],
};

const courseSlice = createSlice({
  name: 'course',
  courseInitialState,
  reducers: {},
});

export const {} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
