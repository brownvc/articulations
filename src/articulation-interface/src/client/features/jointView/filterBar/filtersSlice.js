/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  objectCategory: undefined,
  dataSource: undefined,
  partLabel: undefined,
  grouping: 'Object',
  collection: 'No Collection',
  collectionObjectCategory: undefined,
  collectionPartLabel: undefined,
};

const filters = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setObjectCategory(state, action) {
      state.objectCategory = action.payload;
    },
    setPartLabel(state, action) {
      state.partLabel = action.payload;
    },
    setGrouping(state, action) {
      state.grouping = action.payload;
    },
    setDataSource(state, action) {
      state.dataSource = action.payload;
    },
    setCollection(state, action) {
      state.collection = action.payload;
    },
    setCollectionObjectCategory(state, action) {
      state.collectionObjectCategory = action.payload;
    },
    setCollectionPartLabel(state, action) {
      state.collectionPartLabel = action.payload;
    },
  }
});

export default filters.reducer;
export const {
  setObjectCategory,
  setPartLabel,
  setGrouping,
  setDataSource,
  setCollection,
  setCollectionObjectCategory,
  setCollectionPartLabel,
} = filters.actions;
