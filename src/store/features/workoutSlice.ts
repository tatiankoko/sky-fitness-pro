import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type workoutStateType = {
  _id: string;
  name: string;
  video: string;
  exercises: string[];
};

const workoutInitialState: workoutStateType = {
  _id: '',
  name: '',
  video: '',
  exercises: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  workoutInitialState,
  reducers: {},
});

export const {} = workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
