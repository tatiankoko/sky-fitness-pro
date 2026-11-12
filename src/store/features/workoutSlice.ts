import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseWorkoutType, WorkoutType } from '@/sharedTypes/sharedTypes';

type workoutStateType = {
  selectedWorkout: WorkoutType | null;
  allWorkouts: CourseWorkoutType[];
};

const workoutInitialState: workoutStateType = {
  selectedWorkout: null,
  allWorkouts: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState: workoutInitialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<CourseWorkoutType>) => {
      state.allWorkouts = [...state.allWorkouts, action.payload];
    },
    setSelectedWorkout: (state, action: PayloadAction<WorkoutType>) => {
      state.selectedWorkout = action.payload;
    },
  },
});

export const { addWorkout, setSelectedWorkout } = workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
