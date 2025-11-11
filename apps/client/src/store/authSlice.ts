import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  userId: string | null;
  username: string | null;
  zipcode: string | null;
  loading: boolean | null;
}

const initialState: AuthState = {
  accessToken: null,
  email: null,
  userId: null,
  username: null,
  zipcode: null,
  loading: true,
};

type LoginPayload = Omit<AuthState, 'loading'>;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
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
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, loading } = authSlice.actions;
export default authSlice.reducer;
