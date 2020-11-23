/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import Constants from '../../util/Constants';
import {
  addJointToCollection, removeJointFromCollection, updateCollectionNameAPI, getCollectionsAPI
} from '../../api/collections';
import { getSuggestions } from '../../api/suggestions';
import { makeJointID, simpleMakeJointID } from './jointPropType';
import postWithUsername from '../../api/postWithUsername';
import { showNotification } from '../notification/notificationSlice';

const collections = createSlice({
  name: 'collections',
  initialState: {
    collections: undefined,
    collectionsLoaded: false,
    creatingNewCollection: false,
    selectedCollectionID: undefined,
    error: null,
    suggestions: undefined,
    fetchingSuggestions: false,
    showingSuggestions: false,
    applyingRules: false,
    editingNameOfCollectionID: undefined,

    // If this is defined, the modal pops up.
    deletingCollectionID: undefined,
  },
  reducers: {
    // Sets the collections to be the payload's.
    fetchSuccess(state, action) {
      state.collections = action.payload;
      state.collections.forEach((collection) => { collection.joints = collection.joints || []; });
      state.error = null;
      state.collectionsLoaded = true;
    },

    // Sets the slice's error to be the payload's.
    fetchFailure(state, action) {
      state.collections = undefined;
      state.error = action.payload;
    },

    // Adds a collection.
    createSuccess(state, action) {
      state.collections = state.collections.concat(action.payload);
      state.error = null;
    },

    // Deletes a collection.
    deleteSuccess(state, action) {
      // Finds the collection that should be deleted.
      const indexToRemove = state.collections.findIndex(
        collection => collection.id === action.payload
      );
      state.collections.splice(indexToRemove, 1);
      state.deletingCollectionID = undefined;
    },

    // Makes the collection creation modal appear.
    beginCreateNewCollection(state) {
      state.creatingNewCollection = true;
    },

    // Makes the collection creation modal disappear.
    cancelCreateNewCollection(state) {
      state.creatingNewCollection = false;
    },

    // Stores the specified joint.
    // Since joints only holds joints for the currently selected collection,
    // the joint is discarded if another collection is selected. This check
    // is necessary because adding a joint happens asynchronously.
    addJointSuccess(state, action) {
      const { collectionID, joint } = action.payload;
      const collection = state.collections.find(c => c.id === collectionID);
      collection.joints.push(joint);
    },

    // Removes the specified joint.
    // Since joints only holds joints for the currently selected collection,
    // the joint is discarded if another collection is selected. This check
    // is necessary because removing a joint happens asynchronously.
    removeJointSuccess(state, action) {
      const { collectionID, basePartID, movingPartID } = action.payload;
      const { joints } = state.collections.find(c => c.id === collectionID);
      const index = joints.findIndex(
        joint => joint.base_part_id === basePartID && joint.moving_part_id === movingPartID
      );
      if (index !== -1) {
        joints.splice(index, 1);
      }
    },

    // Selects the specified collection.
    selectCollection(state, action) {
      state.selectedCollectionID = action.payload.id;
    },

    // Deselects any currently selected collection.
    deselectCollection(state) {
      state.selectedCollectionID = undefined;
      state.suggestions = undefined;
      state.showingSuggestions = false;
    },

    // Sets the suggestions to be the payload's.
    // Since suggestions only holds suggestions for the currently selected collection,
    // the suggestions are discarded if another collection is selected. This check
    // is necessary because getting suggestions happens asynchronously.
    setSuggestions(state, action) {
      const { collectionID, suggestions } = action.payload;
      if (state.selectedCollectionID === collectionID) {
        state.suggestions = suggestions;
        state.showingSuggestions = true;
      }
    },

    // Shows the spinner that indicates that suggestions are being fetched.
    beginFetchingSuggestions(state) {
      state.fetchingSuggestions = true;
    },

    // Hides the spinner that indicates that suggestions are being fetched.
    endFetchingSuggestions(state) {
      state.fetchingSuggestions = false;
    },

    // Hides the suggestion shelf.
    hideSuggestions(state) {
      state.showingSuggestions = false;
    },

    // Removes a suggested joint from the suggestions.
    removeSuggestion(state, action) {
      const rejected = action.payload;
      if (Array.isArray(state.suggestions)) {
        const rejectedIndex = state.suggestions.findIndex(
          suggestion => (suggestion.joint.base_part_id === rejected.base_part_id
            && suggestion.joint.moving_part_id === rejected.moving_part_id)
        );
        if (rejectedIndex !== -1) {
          state.suggestions.splice(rejectedIndex, 1);
        }
      }
    },

    // This is used to enable/disable the relevant spinners.
    setApplyingRules(state, action) {
      state.applyingRules = action.payload;
    },

    // Updates the articulations stored for the specified joints.
    // This is used by the apply rule to multiple joints API call.
    updateArticulations(state, action) {
      const { collectionID, articulations } = action.payload;

      // Creates a map of joint ID to articulation.
      const jointToArticulation = new Map();
      articulations.forEach((item) => {
        const id = simpleMakeJointID(item.basePartID, item.movingPartID);
        jointToArticulation.set(id, item.articulation);
      });

      // Uses the map to update all present articulations.
      const { joints } = state.collections.find(c => c.id === collectionID);
      joints.forEach((joint) => {
        const jointID = makeJointID(joint);
        if (jointToArticulation.has(jointID)) {
          joint.articulation = jointToArticulation.get(jointID);
        }
      });
    },

    // Makes the modal show up.
    beginEditCollectionName(state, action) {
      state.editingNameOfCollectionID = action.payload;
    },

    // Finalizes the renaming of a collection by updating its name in the UI.
    renameCollection(state, action) {
      const { collectionID, newName } = action.payload;
      state.editingNameOfCollectionID = undefined;
      state.collections.filter(c => c.id === collectionID).forEach((c) => { c.name = newName; });
    },

    // This shows/hides the delete collection modal.
    setDeletingCollectionID(state, action) {
      state.deletingCollectionID = action.payload;
    },
  }
});

export const {
  fetchSuccess,
  fetchFailure,
  createSuccess,
  deleteSuccess,
  beginCreateNewCollection,
  cancelCreateNewCollection,
  fetchJointsSuccess,
  removeJointSuccess,
  addJointSuccess,
  selectCollection,
  deselectCollection,
  setSuggestions,
  beginFetchingSuggestions,
  endFetchingSuggestions,
  hideSuggestions,
  removeSuggestion,
  setApplyingRules,
  updateArticulations,
  beginEditCollectionName,
  renameCollection,
  removeRules,
  setDeletingCollectionID,
} = collections.actions;

export default collections.reducer;

export const fetchCollections = () => async (dispatch) => {
  try {
    // Fetches the part labels and converts them to a list.
    dispatch(fetchSuccess(await getCollectionsAPI()));
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Fetching collections failed. See the console for more details.');
    dispatch(fetchFailure(err.toString()));
    console.error(err);
  }
};

export const createNewCollection = collectionName => async (dispatch) => {
  // This causes the modal to be hidden.
  dispatch(cancelCreateNewCollection());

  // Sends the new request to the server.
  try {
    const response = await postWithUsername(`${Constants.baseURL}/articulation-program/collection`, {
      name: collectionName
    });

    // If the request was successful, updates the collection list.
    if (response.ok) {
      const { result } = await response.json();
      dispatch(createSuccess([{
        id: result.id,
        name: collectionName,
        joints: [],
      }]));
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Creating a new collection failed. See the console for more details.');
  }
};

export const deleteCollection = collectionID => async (dispatch) => {
  // Sends the new request to the server.
  try {
    const { ok } = await postWithUsername(`${Constants.baseURL}/articulation-program/collection`, {
      id: collectionID
    }, 'DELETE');

    // If the request was successful, updates the collection list.
    if (ok) {
      dispatch(deleteSuccess(collectionID));
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Deleting a new collection failed. See the console for more details.');
  } finally {
    dispatch(setDeletingCollectionID(undefined));
  }
};

export const addJoint = (
  collectionID, basePartAndObjectInformation, movingPartAndObjectInformation, useAcceptInstead
) => async (dispatch) => {
  // Extracts the part IDs.
  const basePart = basePartAndObjectInformation.part;
  const movingPart = movingPartAndObjectInformation.part;

  // Makes the API call.
  try {
    const response = await addJointToCollection(
      collectionID, basePart.part_id, movingPart.part_id, useAcceptInstead
    );

    // Stores the new joint upon success.
    // Passing collection ID ensures that the joint only appears if the collection is still shown.
    if (response.ok) {
      dispatch(addJointSuccess({
        collectionID,
        joint: {
          base_part_id: parseInt(basePart.part_id, 10),
          base_part_index: parseInt(basePart.part_index, 10),
          full_id: basePartAndObjectInformation.full_id,
          moving_part_id: parseInt(movingPart.part_id, 10),
          moving_part_index: parseInt(movingPart.part_index, 10),
          object_id: parseInt(basePartAndObjectInformation.object_id, 10),
          articulation: {}
        }
      }));
    } else {
      const { message } = await response.json();
      dispatch(showNotification(message || 'Could not add joint to collection for an unspecified reason.'));
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Adding a joint to a collection failed. See the console for more details.');
  }
};

export const removeJoint = (
  collectionID, basePartID, movingPartID
) => async (dispatch) => {
  // Makes the API call.
  try {
    const { ok } = await removeJointFromCollection(collectionID, basePartID, movingPartID);

    // Removes the joint upon success.
    // The collection ID ensures that the joint only disappears if the collection is still shown.
    if (ok) {
      dispatch(removeJointSuccess({
        collectionID,
        basePartID,
        movingPartID,
      }));
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Removing a joint from a collection failed. See the console for more details.');
  }
};

export const fetchSuggestions = (
  collectionID, source, category, partLabel, taskName
) => async (dispatch) => {
  dispatch(beginFetchingSuggestions());
  getSuggestions(collectionID, source, category, partLabel, taskName).then((suggestions) => {
    dispatch(setSuggestions({
      collectionID,
      suggestions,
    }));
    dispatch(endFetchingSuggestions());
  });
};

export const updateCollectionName = (collectionID, newName) => async (dispatch) => {
  try {
    const { ok } = await updateCollectionNameAPI(collectionID, newName);
    if (ok) {
      dispatch(renameCollection({ collectionID, newName }));
    } else {
      // eslint-disable-next-line no-alert
      alert('Renaming a collection failed. See the console for more details.');
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Renaming a collection failed. See the console for more details.');
  }
};
