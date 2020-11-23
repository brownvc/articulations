import { combineReducers } from '@reduxjs/toolkit';
import jointView from '../features/jointView/jointViewReducer';
import collectionView from '../features/collectionView/collectionViewReducer';
import editorView from '../features/editorView/editorSlice';
import settingsSlice from '../features/settings/settingsSlice';
import notificationSlice from '../features/notification/notificationSlice';
import hoverSlice from '../features/hover/hoverSlice';
import sessionSlice from '../features/session/sessionSlice';
import jointAttributesSlice from '../features/editorView/jointAttributes/jointAttributesSlice';

const rootReducer = combineReducers({
  jointView,
  collectionView,
  editorView,
  settingsSlice,
  notificationSlice,
  hoverSlice,
  sessionSlice,
  jointAttributesSlice,
});

export default rootReducer;
