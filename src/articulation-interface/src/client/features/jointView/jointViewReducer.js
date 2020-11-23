import { combineReducers } from '@reduxjs/toolkit';
import filtersSlice from './filterBar/filtersSlice';
import jointsSlice from './jointsSlice';
import detailSlice from './detailView/detailSlice';

const jointViewReducer = combineReducers({
  filters: filtersSlice,
  joints: jointsSlice,
  detail: detailSlice,
});

export default jointViewReducer;
