import { createSlice } from '@reduxjs/toolkit';

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
  initialState: workoutInitialState,
  reducers: {},
});

export const {} = workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
