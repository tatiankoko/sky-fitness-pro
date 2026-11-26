import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseWorkoutType } from '@/sharedTypes/sharedTypes';
import { setAccessToken, setLogout } from '@/store/features/authSlice';

type workoutStateType = {
  allWorkouts: CourseWorkoutType[];
  fetchErrorByCourse: Record<string, string | null>;
  fetchIsLoadingByCourse: Record<string, boolean>;
};

const initialState: workoutStateType = {
  allWorkouts: [],
  fetchErrorByCourse: {},
  fetchIsLoadingByCourse: {},
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    startWorkoutFetch: (state, action: PayloadAction<{ courseId: string }>) => {
      state.fetchIsLoadingByCourse[action.payload.courseId] = true;
      state.fetchErrorByCourse[action.payload.courseId] = null;
    },
    addWorkout: (state, action: PayloadAction<CourseWorkoutType>) => {
      const index = state.allWorkouts.findIndex(
        (item) => item.courseId === action.payload.courseId,
      );
      if (index === -1) {
        state.allWorkouts.push(action.payload);
      } else {
        state.allWorkouts[index] = action.payload;
      }

      state.fetchIsLoadingByCourse[action.payload.courseId] = false;
      state.fetchErrorByCourse[action.payload.courseId] = null;
    },
    setWorkoutFetchError: (
      state,
      action: PayloadAction<{
        courseId: string;
        error: string;
      }>,
    ) => {
      state.fetchIsLoadingByCourse[action.payload.courseId] = false;
      state.fetchErrorByCourse[action.payload.courseId] = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAccessToken, () => initialState)
      .addCase(setLogout, () => initialState);
  },
});

export const { startWorkoutFetch, addWorkout, setWorkoutFetchError } =
  workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
