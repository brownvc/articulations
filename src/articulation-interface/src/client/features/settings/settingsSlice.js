/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settingsSlice',
  initialState: {
    showingSettings: false,
    datasetTileSize: 100,
    collectionTileSize: 200,
    usePrerenderedThumbnails: false,
  },
  reducers: {
    showSettings(state) {
      state.showingSettings = true;
    },
    hideSettings(state) {
      state.showingSettings = false;
    },
    setDatasetTileSize(state, action) {
      state.datasetTileSize = action.payload;
    },
    setCollectionTileSize(state, action) {
      state.collectionTileSize = action.payload;
    },
    setUsePrerenderedThumbnails(state, action) {
      state.usePrerenderedThumbnails = action.payload;
    },
  }
});

export default settingsSlice.reducer;
export const {
  showSettings,
  hideSettings,
  setDatasetTileSize,
  setCollectionTileSize,
  setUsePrerenderedThumbnails,
} = settingsSlice.actions;
