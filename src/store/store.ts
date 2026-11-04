import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import { courseSliceReducer } from '@/store/features/courseSlice';
import { workoutSliceReducer } from '@/store/features/workoutSlice';
import { authSliceReducer } from '@/store/features/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      /*courses: courseSliceReducer,
      workouts: workoutSliceReducer,*/
      user: authSliceReducer,
    }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the \`RootState\` and \`AppDispatch\` types from the store itself
type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Use throughout your app instead of plain \`useDispatch\` and \`useSelector\`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
