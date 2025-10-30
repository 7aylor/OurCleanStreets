import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  userId: string | null;
  username: string | null;
  zipcode: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  email: null,
  userId: null,
  username: null,
  zipcode: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.zipcode = action.payload.zipcode;
    },
    logout: (state) => {
      state.accessToken = null;
      state.email = null;
      state.userId = null;
      state.username = null;
      state.zipcode = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
