import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userType } from '@/sharedTypes/sharedTypes';

type authStateType = {
  user: userType | null;
  accessToken: string | null;
  isAuth: boolean;
};

const initialState: authStateType = {
  user: null,
  accessToken: null,
  isAuth: false,
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
    setIsAuth(state) {
      state.isAuth = true;
    },
    setLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuth = false;

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setIsAuth,
  setLogout,
} = authSlice.actions;

export const authSliceReducer = authSlice.reducer;
