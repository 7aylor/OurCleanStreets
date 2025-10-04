import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

export type AuthRootState = ReturnType<typeof store.getState>;
export type AuthDispatch = typeof store.dispatch;
