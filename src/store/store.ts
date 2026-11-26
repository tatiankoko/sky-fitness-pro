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
import { setupApiInterceptors } from '@/services/apiClient';

export const makeStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      courses: courseSliceReducer,
      workouts: workoutSliceReducer,
      user: authSliceReducer,
    }),
  });

  if (typeof window !== 'undefined') {
    setupApiInterceptors(store.dispatch);
  }

  return store;
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
