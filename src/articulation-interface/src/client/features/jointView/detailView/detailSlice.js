/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import Constants from '../../../util/Constants';

const detailSlice = createSlice({
  name: 'detailSlice',
  initialState: {
    selection: null,
    selectionType: null,
    selectedPartAndObjectInformation: null,
  },
  reducers: {
    // Detail selections happen based on a type and an identifier.
    // For example, for object categories, the type is 'Object Category' and the identifier is the category string.
    toggleDetailSelection(state, action) {
      if (state.selection === action.payload.selection) {
        state.selection = null;
        state.selectionType = null;
      } else {
        state.selection = action.payload.selection;
        state.selectionType = action.payload.selectionType;
      }
      state.selectedPartAndObjectInformation = null;
    },

    // Removes the detail selection.
    removeDetailSelection(state) {
      state.selection = null;
      state.selectionType = null;
      state.selectedPartAndObjectInformation = null;
    },

    // Hides the moving part popover that shows the base parts.
    removePopover(state) {
      state.selectedPartAndObjectInformation = null;
    },

    // Toggles the part selection.
    // The payload should include the selected tile's entire subject.
    // In other words, payload should be a partAndObjectInformationPropType.
    togglePartSelection(state, action) {
      if (state.selectedPartAndObjectInformation
        && state.selectedPartAndObjectInformation.part.part_id === action.payload.part.part_id) {
        state.selectedPartAndObjectInformation = null;
      } else {
        state.selectedPartAndObjectInformation = action.payload;
      }
    },

    // Removes the part selection.
    removePartSelection(state) {
      state.selectedPartAndObjectInformation = null;
    }
  }
});

export const {
  toggleDetailSelection,
  removeDetailSelection,
  togglePartSelection,
  removePartSelection,
  removePopover,
} = detailSlice.actions;

export const selectionPropType = PropTypes.shape({
  selection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectionType: PropTypes.oneOf(Constants.tileTypes),
});

export default detailSlice.reducer;
