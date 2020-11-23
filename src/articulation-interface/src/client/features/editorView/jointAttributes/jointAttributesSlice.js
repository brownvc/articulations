/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { makeJointID } from '../../collectionView/jointPropType';
import { showNotification } from '../../notification/notificationSlice';
import { getJointAttributesAPI } from '../../../api/jointAttributes';

const initialState = {
  attributes: {},
  selectedJoint: undefined,

  // This is separate because the world XYZ can be shown while showing articulations.
  showWorldXYZ: false,

  show: {
    base_axis1_bottom: false,
    base_axis1_direction: false,
    base_axis1_top: false,

    base_axis2_bottom: false,
    base_axis2_direction: false,
    base_axis2_top: false,

    base_axis3_bottom: false,
    base_axis3_direction: false,
    base_axis3_top: false,

    base_center: false,

    contact_center: false,

    moving_axis1_bottom: false,
    moving_axis1_direction: false,
    moving_axis1_top: false,

    moving_axis2_bottom: false,
    moving_axis2_direction: false,
    moving_axis2_top: false,

    moving_axis3_bottom: false,
    moving_axis3_direction: false,
    moving_axis3_top: false,

    moving_center: false,
  },
};

const jointAttributesSlice = createSlice({
  name: 'jointAttributesSlice',
  initialState,
  reducers: {
    // Associates joints with their attributes.
    addAttributes(state, action) {
      action.payload.forEach((information) => {
        state.attributes[makeJointID({
          base_part_id: information.base_part_id,
          moving_part_id: information.moving_part_id,
        })] = information.attributes;
      });
    },

    // Hides or shows the property display.
    setSelectedJoint(state, action) {
      state.selectedJoint = action.payload;
    },

    // Hides or shows world XYZ axes.
    setShowWorldXYZ(state, action) {
      state.showWorldXYZ = action.payload;
    },

    // Updates what's shown.
    setShow(state, action) {
      const { what, value } = action.payload;
      state.show[what] = value;
      console.log(state.show);
    },

    // Resets everything in show to false.
    resetShow(state) {
      Object.keys(state.show).forEach((k) => { state.show[k] = false; });
    },
  }
});

export default jointAttributesSlice.reducer;
export const {
  addAttributes,
  setSelectedJoint,
  setShowWorldXYZ,
  setShow,
  resetShow,
} = jointAttributesSlice.actions;

export const getJointAttributes = joints => async (dispatch) => {
  try {
    const response = await getJointAttributesAPI(joints);
    if (response.ok) {
      const results = await response.json();
      const clientFormatResults = results.map((result) => {
        // Converts to attributePropType.
        const clientFormatAttributes = {};
        Object.entries(result.attributes).forEach((entry) => {
          const [base, thing] = entry;
          Object.entries(thing).forEach((e) => {
            const [key, value] = e;
            clientFormatAttributes[`${base}_${key}`] = value;
          });
        });
        return {
          attributes: clientFormatAttributes,
          base_part_id: result.base_part_id,
          moving_part_id: result.moving_part_id,
        };
      });
      dispatch(addAttributes(clientFormatResults));
    }
  } catch (err) {
    dispatch(showNotification('Could not get joint attributes. See the console for more details.'));
    console.error(err);
  }
};
