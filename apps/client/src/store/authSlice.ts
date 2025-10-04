import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  email: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.accessToken = null;
      state.email = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
