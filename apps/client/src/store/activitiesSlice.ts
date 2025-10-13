import type { IActivity } from '@ocs/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: IActivity[] = [];

const activitiesSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setActivities: (_state, action: PayloadAction<IActivity[]>) => {
      return action.payload;
    },
  },
});

export const { setActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;
