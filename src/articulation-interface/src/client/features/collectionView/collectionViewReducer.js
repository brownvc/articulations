import { combineReducers } from '@reduxjs/toolkit';
import visibilitySlice from './visibilitySlice';
import collectionsSlice from './collectionsSlice';

const collectionViewReducer = combineReducers({
  visibility: visibilitySlice,
  collections: collectionsSlice,
});

export default collectionViewReducer;
