import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutType } from '@/sharedTypes/sharedTypes';

type workoutStateType = {
  allWorkouts: WorkoutType[];
};

const workoutInitialState: workoutStateType = {
  allWorkouts: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState: workoutInitialState,
  reducers: {
    setAllWorkouts: (state, action: PayloadAction<WorkoutType[]>) => {
      state.allWorkouts = action.payload;
    },
  },
});

export const { setAllWorkouts } = workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
