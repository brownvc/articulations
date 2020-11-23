/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hoverType: undefined,
  hoverTarget: undefined,
};

const hoverSlice = createSlice({
  name: 'hoverSlice',
  initialState,
  reducers: {
    endHover(state) {
      state.hoverType = undefined;
      state.hoverTarget = undefined;
    },
    hoverObject(state, action) {
      state.hoverType = 'object';
      state.hoverTarget = action.payload;
    },
    hoverPart(state, action) {
      state.hoverType = 'part';
      state.hoverTarget = action.payload;
    },
  }
});

export default hoverSlice.reducer;
export const {
  endHover,
  hoverObject,
  hoverPart,
} = hoverSlice.actions;
