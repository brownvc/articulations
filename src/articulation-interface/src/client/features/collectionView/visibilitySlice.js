/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const visibility = createSlice({
  name: 'visibility',
  initialState: {
    visible: true,
  },
  reducers: {
    toggleVisibility(state) {
      state.visible = !state.visible;
    },
  }
});

export default visibility.reducer;
export const {
  toggleVisibility,
} = visibility.actions;
