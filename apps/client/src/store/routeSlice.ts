import type { ICoordinate } from '@ocs/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface RouteState {
  coordinates: ICoordinate[];
  duration: number;
  distance: number;
}

const initialState: RouteState = {
  coordinates: [],
  duration: 0,
  distance: 0,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    currentRoute: (state, action: PayloadAction<RouteState>) => {
      state.coordinates = action.payload.coordinates ?? [];
      state.duration = action.payload.duration;
      state.distance = action.payload.distance;
    },
  },
});

export const { currentRoute } = routeSlice.actions;
export default routeSlice.reducer;
