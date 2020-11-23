/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: undefined,
};

const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    showNotification(state, action) {
      state.message = action.payload;
    },
    hideNotification(state) {
      state.message = undefined;
    }
  }
});

export default notificationSlice.reducer;
export const {
  showNotification,
  hideNotification,
} = notificationSlice.actions;
