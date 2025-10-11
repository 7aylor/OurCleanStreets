import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import routeReducer from './routeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    route: routeReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
