import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutType } from '@/sharedTypes/sharedTypes';

type workoutStateType = {
  selectedWorkout: WorkoutType | null;
  allWorkouts: WorkoutType[];
};

const workoutInitialState: workoutStateType = {
  selectedWorkout: null,
  allWorkouts: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState: workoutInitialState,
  reducers: {
    setAllWorkouts: (state, action: PayloadAction<WorkoutType[]>) => {
      state.allWorkouts = action.payload;
    },
    setSelectedWorkout: (state, action: PayloadAction<WorkoutType>) => {
      state.selectedWorkout = action.payload;
    },
  },
});

export const { setAllWorkouts, setSelectedWorkout } = workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
