/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import Constants from '../../util/Constants';
import { filterObjects } from './taskFilter';
import postWithUsername from '../../api/postWithUsername';

const joints = createSlice({
  name: 'joints',
  initialState: {
    unconfirmedJoints: null,
    dataSources: [],
    objectCategories: {},
    partLabels: {},
    error: null,
    taskName: undefined,
  },
  reducers: {
    fetchSuccess(state, action) {
      const { json, taskName } = action.payload;
      state.taskName = taskName;
      state.unconfirmedJoints = filterObjects(json.filter(
        object => Constants.enabledDatasets.includes(object.source)
      ), taskName);

      // Finds all the data sources, object categories and part labels.
      // Object categories and part labels are mapped to the data sources they're in.
      state.unconfirmedJoints.forEach((object) => {
        // Adds the data source.
        const { source, category } = object;
        if (!state.dataSources.includes(source)) {
          state.dataSources.push(source);
        }

        // Adds the object category.
        if (category) {
          category.split(',').forEach((cat) => {
            if (!state.objectCategories[cat]) {
              state.objectCategories[cat] = [source];
            } else if (!state.objectCategories[cat].includes(source)) {
              state.objectCategories[cat].push(source);
            }
          });
        }

        // Adds the part labels.
        object.parts.forEach((part) => {
          if (part.part_label) {
            part.part_label.split(',').forEach((partLabel) => {
              if (!state.partLabels[partLabel]) {
                state.partLabels[partLabel] = [source];
              } else if (!state.partLabels[partLabel].includes(source)) {
                state.partLabels[partLabel].push(source);
              }
            });
          }
        });
      });
      state.error = null;
    },
    fetchFailure(state, action) {
      state.unconfirmedJoints = [];
      state.error = action.payload;
    },
  }
});

export const {
  fetchSuccess,
  fetchFailure,
} = joints.actions;

export default joints.reducer;

export const fetchJoints = taskName => async (dispatch) => {
  try {
    // Fetches the part labels and converts them to a list.
    const json = await postWithUsername(`${Constants.baseURL}/verification-viewer/load`, {
      type: 'unconfirmed'
    }).then(response => response.json());
    dispatch(fetchSuccess({
      json,
      taskName,
    }));
  } catch (err) {
    dispatch(fetchFailure(err.toString()));
  }
};
