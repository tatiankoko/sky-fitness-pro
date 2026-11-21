import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userType } from '@/sharedTypes/sharedTypes';

type authStateType = {
  user: userType | null;
  accessToken: string | null;
  authInitialized: boolean; // localStorage прочитан
};

const initialState: authStateType = {
  user: null,
  accessToken: null,
  authInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<userType>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    setAuthInitialized(state) {
      state.authInitialized = true;
    },
    setLogout(state) {
      state.user = null;
      state.accessToken = null;

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setUser, setAccessToken, setAuthInitialized, setLogout } =
  authSlice.actions;

export const authSliceReducer = authSlice.reducer;
