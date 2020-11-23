/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  addRuleToCollection,
  getRulesForCollection,
  getAllRules,
  deleteRuleFromCollectionAPI,
  updateRuleAPI,
  deleteRuleAPI,
  addLibraryRuleToCollectionAPI,
  applyRulesAPI,
  suggestRulesAPI,
  runRulesAPI,
  renameRuleAPI,
  unApplyRuleAPI,
} from '../../api/rules';
import { makeJointID } from '../collectionView/jointPropType';
import { updateArticulations, setApplyingRules } from '../collectionView/collectionsSlice';
import Constants from '../../util/Constants';
import { showNotification } from '../notification/notificationSlice';
import { capitalize } from '../../util/stringTools';

const editor = createSlice({
  name: 'editor',
  initialState: {
    collectionID: undefined,
    addingRuleType: undefined,
    rules: undefined,
    selectedJoints: [],
    libraryRules: undefined,
    selectedRuleID: undefined,
    ruleUnsavedStatuses: {},
    suggestedArticulations: {},
    fetchingRuleSuggestions: false,
    animationPaused: false,
    inVisualizationMode: false,
    gettingVisualization: false,
    visualizedArticulations: {},
    visualizedErrors: {},

    // Maps rule IDs to rule errors.
    ruleErrors: {},

    // If this is defined, the rule deletion modal will appear.
    ruleToRemoveInfo: undefined,

    // If this is defined, the rule renaming modal will appear.
    ruleBeingRenamedID: undefined,

    // Prevents the rule from being edited while it's being saved.
    savingRule: false,

    // If this is defined, the deletion modal will appear.
    libraryRuleBeingDeletedID: undefined,

    // Holds the IDs of joints that are loaded and no longer need a spinner.
    loadedJoints: {},

    // If this is defined, the rule duplication modal appears.
    ruleToDuplicate: undefined,
  },
  reducers: {
    // Shows the rule editor.
    showEditor(state, action) {
      state.rules = undefined;
      state.collectionID = action.payload;
      state.loadedJoints = {};
      state.selectedRuleID = undefined;
      state.selectedJoints = [];
      state.suggestedArticulations = {};
    },

    // Hides the rule editor.
    hideEditor(state) {
      state.rules = undefined;
      state.collectionID = undefined;
      state.loadedJoints = {};
      state.selectedJoints = [];
      state.suggestedArticulations = {};
      state.inVisualizationMode = false;
    },

    // Selects a joint by adding its joint ID to the list of selected joints.
    toggleJointSelection(state, action) {
      const jointID = makeJointID(action.payload);
      const index = state.selectedJoints.findIndex(selectedJointID => selectedJointID === jointID);
      if (index !== -1) {
        state.selectedJoints.splice(index, 1);
      } else {
        state.selectedJoints.push(jointID);
      }
    },

    // Deselects a joint by removing its joint ID from the list of selected joints.
    deselectJoint(state, action) {
      const jointID = makeJointID(action.payload);
      const index = state.selectedJoints.findIndex(selectedJointID => selectedJointID === jointID);
      if (index !== -1) {
        state.selectedJoints.splice(index, 1);
      }
    },

    // Shows the add rule modal.
    showAddRuleModal(state, action) {
      state.addingRuleType = action.payload;
      state.libraryRules = undefined;
    },

    // Hides the add rule modal without changing anything else.
    hideAddRuleModal(state) {
      state.addingRuleType = undefined;
    },

    // Toggles selection for the specified rule.
    toggleRuleSelection(state, action) {
      const ruleID = action.payload;
      if (state.selectedRuleID === ruleID) {
        state.selectedRuleID = undefined;
      } else {
        state.selectedRuleID = ruleID;
      }
    },

    // Makes the UI show an additional rule and hides the add rule modal.
    // Since rules only holds rules for the currently selected collection,
    // the rule is discarded if another collection is selected. This check
    // is necessary because adding a rule happens asynchonously.
    addRuleSuccess(state, action) {
      const { collectionID, rule, closeModal } = action.payload;
      if (state.collectionID === collectionID) {
        // If the rules haven't been loaded yet, the array is created.
        if (Array.isArray(state.rules)) {
          state.rules.push(rule);
        } else {
          state.rules = [rule];
        }
      }
      if (closeModal) {
        state.addingRuleType = undefined;
      }
    },

    // Makes the UI hide the given rule.
    // Since rules only holds rules for the currently selected collection,
    // the action is discarded if another collection is selected. This check
    // is necessary because deleting a rule happens asynchonously.
    removeRuleFromCollectionSuccess(state, action) {
      const { collectionID, ruleID } = action.payload;
      if (state.collectionID === collectionID && Array.isArray(state.rules)) {
        // Deselects the rule if it's selected.
        if (state.selectedRuleID === ruleID) {
          state.selectedRuleID = undefined;
        }

        // Removes the rule from the UI.
        const ruleIndex = state.rules.findIndex(rule => rule.id === ruleID);
        if (ruleIndex !== -1) {
          state.rules.splice(ruleIndex, 1);
        }
      }
    },

    // Adds the given rules to the UI.
    // Since rules only holds rules for the currently selected collection,
    // the rules are discarded if another collection is selected. This check
    // is necessary because fetching rules happens asynchonously.
    fetchRulesSuccess(state, action) {
      const { collectionID, rules } = action.payload;
      if (state.collectionID === collectionID) {
        // If the rules haven't been loaded yet, the array is created.
        if (Array.isArray(state.rules)) {
          state.rules.concat(rules);
        } else {
          state.rules = rules;
        }
      }
      state.addingRuleType = undefined;
    },

    // Sets the library rules to be the action's payload
    fetchLibraryRulesSuccess(state, action) {
      state.libraryRules = action.payload;
    },

    // Updates the locally saved rule text.
    updateRuleText(state, action) {
      const { ruleID, text } = action.payload;
      if (state.rules) {
        const rule = state.rules.find(r => r.id === ruleID);
        if (rule && rule.text !== text) {
          rule.text = text;
          state.ruleUnsavedStatuses[ruleID] = true;
        }
      }
    },

    // Sets the rule to be unsaved.
    // This makes the little icon appear next to it.
    setRuleUnsaved(state, action) {
      state.ruleUnsavedStatuses[action.payload] = true;
    },

    // Sets the rule to be saved.
    // This makes the little icon next to it disappear.
    setRuleSaved(state, action) {
      const { ruleID, newText } = action.payload;
      if (state.rules) {
        const rule = state.rules.find(r => r.id === ruleID);
        rule.text = newText;
      }
      delete state.ruleUnsavedStatuses[ruleID];
    },

    // Deletes a rule from the library and the current collection.
    deleteRuleSuccess(state, action) {
      state.libraryRuleBeingDeletedID = undefined;
      const ruleID = action.payload;

      // Deletes the rule from the current collection.
      if (Array.isArray(state.rules)) {
        // Deselects the rule if it's selected.
        if (state.selectedRuleID === ruleID) {
          state.selectedRuleID = undefined;
        }

        // Removes the rule from the UI.
        const ruleIndex = state.rules.findIndex(rule => rule.id === ruleID);
        if (ruleIndex !== -1) {
          state.rules.splice(ruleIndex, 1);
        }
      }

      // Deletes the rule from the library.
      if (Array.isArray(state.libraryRules)) {
        const ruleIndex = state.libraryRules.findIndex(rule => rule.id === ruleID);
        if (ruleIndex !== -1) {
          state.libraryRules.splice(ruleIndex, 1);
        }
      }
    },

    // Updates the rule suggestions.
    addRuleSuggestions(state, action) {
      state.fetchingRuleSuggestions = false;
      action.payload.forEach((suggestion) => {
        const { jointID, articulation } = suggestion;
        state.suggestedArticulations[jointID] = articulation;
      });
    },

    // Sets fetching suggestions (enables or disables the suggest rules spinner).
    setFetchingRuleSuggestions(state, action) {
      state.fetchingRuleSuggestions = action.payload;
    },

    // Removes a rule suggestion.
    hideRuleSuggestion(state, action) {
      delete state.suggestedArticulations[action.payload];
    },

    // Sets whether animation should be paused.
    setAnimationPaused(state, action) {
      state.animationPaused = action.payload;
    },

    // Deselects all joints.
    deselectAllJoints(state) {
      state.selectedJoints = [];
    },

    // Selects all joints in the payload.
    selectAllJoints(state, action) {
      state.selectedJoints = action.payload.map(joint => makeJointID(joint));
    },

    // Sets visualization mode.
    setInVisualizationMode(state, action) {
      state.inVisualizationMode = action.payload;
      state.visualizedArticulations = {};
      state.visualizedErrors = {};
    },

    // Sets whether a new visualization is currently being loaded.
    setGettingVisualization(state, action) {
      const { value, reset } = action.payload;
      state.gettingVisualization = value;
      if (reset) {
        state.visualizedArticulations = {};
      }
    },

    // Updates the rule visualizations.
    addRuleVisualizations(state, action) {
      const { reset, visualizations } = action.payload;
      state.gettingVisualization = false;
      if (reset) {
        state.visualizedArticulations = {};
      }
      visualizations.forEach((suggestion) => {
        const { jointID, articulation } = suggestion;
        state.visualizedArticulations[jointID] = articulation;
        delete state.visualizedErrors[jointID];
      });
    },

    // Updates the visualization errors.
    addVisualizationError(state, action) {
      state.visualizedErrors[action.payload] = true;
    },

    // Shows or hides the modal.
    setRuleToRemoveInfo(state, action) {
      state.ruleToRemoveInfo = action.payload;
    },

    // Shows or hides the modal.
    setRuleBeingRenamedID(state, action) {
      state.ruleBeingRenamedID = action.payload;
    },

    // Sets a rule's name.
    setRuleName(state, action) {
      const { ruleID, newName } = action.payload;
      state.rules.filter(r => r.id === ruleID).forEach((r) => { r.name = newName; });
    },

    // Sets or resets the rule error.
    setRuleError(state, action) {
      const { ruleID, error } = action.payload;
      if (error) {
        state.ruleErrors[ruleID] = error;
      } else {
        delete state.ruleErrors[ruleID];
      }
    },

    // This is used to enable or disable the save button and editor.
    setSavingRule(state, action) {
      state.savingRule = action.payload;
    },

    // Gets rid of a visualized articulation/error.
    removeJointFromVisualization(state, action) {
      delete state.visualizedArticulations[action.payload];
      delete state.visualizedErrors[action.payload];
    },

    // Makes the library rule deletion modal appear.
    setLibraryRuleBeingDeletedID(state, action) {
      state.libraryRuleBeingDeletedID = action.payload;
    },

    // Marks a joint as loaded (hides the spinner).
    setJointLoaded(state, action) {
      // The payload should be the joint ID.
      state.loadedJoints[action.payload] = true;
    },

    // Shows the rule duplication modal.
    setRuleToDuplicate(state, action) {
      state.ruleToDuplicate = action.payload;
    },
  }
});

export const {
  showEditor,
  hideEditor,
  showAddRuleModal,
  hideAddRuleModal,
  addRuleSuccess,
  fetchRulesSuccess,
  fetchLibraryRulesSuccess,
  removeRuleFromCollectionSuccess,
  toggleRuleSelection,
  updateRuleText,
  setRuleUnsaved,
  setRuleSaved,
  deleteRuleSuccess,
  toggleJointSelection,
  deselectJoint,
  addRuleSuggestions,
  setFetchingRuleSuggestions,
  hideRuleSuggestion,
  setAnimationPaused,
  deselectAllJoints,
  selectAllJoints,
  setInVisualizationMode,
  setGettingVisualization,
  addRuleVisualizations,
  setRuleToRemoveInfo,
  setRuleBeingRenamedID,
  setRuleName,
  setRuleError,
  setSavingRule,
  addVisualizationError,
  removeJointFromVisualization,
  setLibraryRuleBeingDeletedID,
  setJointLoaded,
  setRuleToDuplicate,
} = editor.actions;

export default editor.reducer;

export const addRule = (
  collectionID, ruleName, ruleType, motionType, addToLibrary, ruleText
) => async (dispatch) => {
  let text = motionType === 'Translation' ? Constants.defaultAxisRuleTranslation : Constants.defaultAxisRuleRotation;
  if (ruleType === 'Range') {
    text = motionType === 'Translation' ? Constants.defaultRangeRuleTranslation : Constants.defaultRangeRuleRotation;
  }
  if (ruleText) {
    text = ruleText;
  }
  const rule = await addRuleToCollection(
    collectionID, ruleName, ruleType, motionType, text, addToLibrary
  );
  if (rule) {
    dispatch(addRuleSuccess({
      collectionID,
      rule,
      closeModal: true,
    }));
  }
};

export const addLibraryRuleToCollection = (
  collectionID, ruleID, closeModal
) => async (dispatch) => {
  try {
    const rule = await addLibraryRuleToCollectionAPI(collectionID, ruleID);
    dispatch(addRuleSuccess({
      collectionID,
      rule,
      closeModal,
    }));
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('The API call for adding a library rule to a collection failed. See the console for more details.');
  }
};

export const startRemoveRuleFromCollection = (collectionID, ruleID) => async (dispatch) => {
  dispatch(setRuleToRemoveInfo({
    collectionID,
    ruleID,
  }));
};

export const removeRuleFromCollection = (
  collectionID, ruleID, deleteFromLibrary
) => async (dispatch) => {
  dispatch(setRuleToRemoveInfo(undefined));
  const result = await deleteRuleFromCollectionAPI(collectionID, ruleID, deleteFromLibrary);
  if (result.ok) {
    dispatch(removeRuleFromCollectionSuccess({
      collectionID,
      ruleID,
    }));
  } else {
    const { message } = await result.json();
    dispatch(showNotification(message || 'Could not remove joint from collection for an unspecified reason.'));
  }
};

export const deleteRule = ruleID => async (dispatch) => {
  try {
    const deleted = await deleteRuleAPI(ruleID);
    if (deleted) {
      dispatch(deleteRuleSuccess(ruleID));
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('The API call for deleting a rule failed. See the console for more details.');
  } finally {
    setLibraryRuleBeingDeletedID(undefined);
  }
};

export const fetchCollectionRules = collectionID => async (dispatch) => {
  getRulesForCollection(collectionID).then((rules) => {
    dispatch(fetchRulesSuccess({
      collectionID,
      rules,
    }));
  }).catch(console.log);
};

export const saveRuleText = (ruleID, newText) => async (dispatch) => {
  try {
    dispatch(setSavingRule(true));
    const ok = await updateRuleAPI(ruleID, undefined, newText);
    if (ok) {
      dispatch(setRuleSaved({
        ruleID, newText
      }));
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('Saving the rule text failed. See the console for more details.');
  } finally {
    dispatch(setSavingRule(false));
  }
};

const parseRule = rule => ({
  basePartID: parseInt(rule.base_part_id, 10),
  movingPartID: parseInt(rule.moving_part_id, 10),
  articulation: {
    motionType: capitalize(rule.motion_type),
    origin: (rule.origin ? rule.origin.map(x => parseFloat(x)) : undefined),
    axis: (rule.axis ? rule.axis.map(x => parseFloat(x)) : undefined),
    minRange: parseFloat(rule.min_range) || 0,
    maxRange: parseFloat(rule.max_range) || 0,
    filename: rule.filename,
    axisRuleID: parseInt(rule.axis_rule_id, 10) || undefined,
    rangeRuleID: parseInt(rule.range_rule_id, 10) || undefined,
    currentPose: parseFloat(rule.current_pose) || 0,
    ref: (rule.ref || []).map(x => parseFloat(x)) || undefined,
  }
});

export const applyRules = (
  collectionID, axisRuleID, rangeRuleID, joints, useAcceptInstead, prerender
) => async (dispatch) => {
  dispatch(setApplyingRules(true));
  try {
    const result = await applyRulesAPI(
      collectionID, axisRuleID, rangeRuleID, joints, useAcceptInstead, prerender
    );
    const json = await result.json();
    if (!result.ok) {
      dispatch(setRuleError({
        ruleID: axisRuleID || rangeRuleID,
        error: json.message.msg,
      }));
      return;
    }
    dispatch(updateArticulations({
      collectionID,
      articulations: json.map(parseRule),
    }));
  } catch (err) {
    dispatch(setApplyingRules(false));
    // eslint-disable-next-line no-alert
    alert('The API call for running multiple rules failed. See the console for more details.');
  } finally {
    dispatch(setApplyingRules(false));
  }
};

export const suggestRules = (collectionID, joints, ruleType, prerender) => async (dispatch) => {
  try {
    dispatch(setFetchingRuleSuggestions(true));
    const result = await suggestRulesAPI(collectionID, joints, ruleType, prerender);
    if (result) {
      if (result.length === 0) {
        dispatch(showNotification('The server returned no suggestions.'));
        dispatch(setFetchingRuleSuggestions(false));
      } else {
        dispatch(addRuleSuggestions(result.map((suggestion, index) => {
          const articulation = {};
          Object.assign(articulation, joints[index].articulation || {});
          if (ruleType === 'Axis') {
            articulation.motionType = capitalize(suggestion.motion_type);
            articulation.origin = suggestion.origin.map(x => parseFloat(x));
            articulation.axis = suggestion.axis.map(x => parseFloat(x));
            articulation.minRange = 0;
            articulation.maxRange = 0;
            articulation.filename = suggestion.filename;
            articulation.axisRuleID = suggestion.rule_id;
            articulation.rangeRuleID = undefined;
          } else {
            articulation.minRange = parseFloat(suggestion.min_range);
            articulation.maxRange = parseFloat(suggestion.max_range);
            articulation.rangeRuleID = suggestion.rule_id;
          }
          articulation.currentPose = parseFloat(suggestion.current_pose) || 0;
          articulation.ref = suggestion.ref.map(x => parseFloat(x));
          return {
            jointID: makeJointID(joints[index]),
            articulation,
          };
        })));
      }
    } else {
      dispatch(setFetchingRuleSuggestions(false));
    }
  } catch (err) {
    dispatch(setFetchingRuleSuggestions(false));
    // eslint-disable-next-line no-alert
    alert('The API call for suggesting rules failed. See the console for more details.');
  }
};

// this is such a mess ugh
export const setRuleToVisualize = (
  rule, wasSelected, collectionID, joints, rules, selectedJointIDs, reset, prerender,
  specialJoint = undefined
) => async (dispatch) => {
  if (!wasSelected) {
    dispatch(setGettingVisualization({
      value: true,
      reset,
    }));

    // Maps each axis rule/range rule combination to the targeted joints.
    const ruleCombinationsToJoints = new Map();
    const selectedJointIDsSet = new Set(selectedJointIDs);
    const selectedJoints = joints.filter(
      joint => selectedJointIDsSet.has(makeJointID(joint))
      || (specialJoint && makeJointID(joint) === makeJointID(specialJoint))
    );
    selectedJoints.forEach((joint) => {
      // Finds axis and range rules.
      let axisRuleID;
      let rangeRuleID;
      if (rule.type === 'Axis') {
        axisRuleID = rule.id;
        ({ rangeRuleID } = joint.articulation);
      } else {
        ({ axisRuleID } = joint.articulation);
        rangeRuleID = rule.id;
      }
      const axisRuleType = (rules.find(r => r.id === axisRuleID) || {}).motionType;
      const rangeRuleType = (rules.find(r => r.id === rangeRuleID) || {}).motionType;

      // Only makes a promise if there are axis and range rules.
      if (axisRuleID && (axisRuleType === rangeRuleType || !rangeRuleID)) {
        // Makes the rule combination ID.
        const ruleCombinationID = `${axisRuleID}/${rangeRuleID}`;
        if (!ruleCombinationsToJoints.has(ruleCombinationID)) {
          ruleCombinationsToJoints.set(ruleCombinationID, []);
        }
        ruleCombinationsToJoints.get(ruleCombinationID).push(joint);
      }
    });

    // If joints were selected for promises, returns.
    if (ruleCombinationsToJoints.length === 0 && selectedJointIDs.length > 0) {
      dispatch(setGettingVisualization({
        value: false,
        reset,
      }));
      return;
    }

    // Compiles the joints and promises into an array.
    // The array's entries are sets of [joints, promise].
    const jointsAndPromises = [];
    ruleCombinationsToJoints.forEach((applicableJoints, ruleCombinationID) => {
      const [axisRuleID, rangeRuleID] = ruleCombinationID.split('/').map(x => parseInt(x, 10));
      jointsAndPromises.push([applicableJoints, runRulesAPI(
        collectionID, axisRuleID, rangeRuleID, applicableJoints, prerender
      )]);
    });


    // Waits for the promises to complete.
    const results = await Promise.all(
      jointsAndPromises.map(entry => entry[1].catch(e => e))
    );
    if (Array.isArray(results)) {
      const jsons = await Promise.all(results.map(r => r.json()));

      // Extracts the results that are good for visualization.
      // Shows error messages for the bad results.
      const visualizations = [];
      jsons.forEach((json, indexInJointsAndPromises) => {
        const { message } = json;
        const currentJoints = jointsAndPromises[indexInJointsAndPromises][0];

        // This can be any joint, since it's only used to figure out rule IDs.
        const joint = currentJoints[0];
        const jointID = makeJointID(joint);

        // Figures out the rule ID.
        let axisRuleID;
        let rangeRuleID;
        if (rule.type === 'Axis') {
          axisRuleID = rule.id;
          ({ rangeRuleID } = joint.articulation);
        } else {
          ({ axisRuleID } = joint.articulation);
          rangeRuleID = rule.id;
        }
        if (message) {
          // It's an error.
          if (message.axis_error) {
            dispatch(setRuleError({
              ruleID: axisRuleID,
              error: message.msg,
            }));
          }
          if (message.range_error) {
            dispatch(setRuleError({
              ruleID: rangeRuleID,
              error: message.msg,
            }));
          }
          dispatch(addVisualizationError(jointID));
        } else {
          let dispatchedNotification = false;
          json.forEach((visualization, indexInCurrentJoints) => {
            if (visualization) {
              visualizations.push({
                jointID: makeJointID(currentJoints[indexInCurrentJoints]),
                articulation: {
                  motionType: capitalize(visualization.motion_type),
                  origin: visualization.origin.map(x => parseFloat(x)),
                  axis: visualization.axis.map(x => parseFloat(x)),
                  minRange: parseFloat(visualization.min_range),
                  maxRange: parseFloat(visualization.max_range),
                  filename: visualization.filename,
                  axisRuleID: parseInt(visualization.axis_rule_id, 10) || undefined,
                  rangeRuleID: parseInt(visualization.range_rule_id, 10) || undefined,
                  currentPose: parseFloat(visualization.current_pose) || 0,
                  ref: (visualization.ref || []).map(x => parseFloat(x)) || undefined,
                }
              });
            } else if (!dispatchedNotification) {
              dispatchedNotification = true;
              dispatch(showNotification('Unexpectedly received empty articulation for a joint.'));
            }
          });
        }
      });

      // If any results were good, shows them.
      if (visualizations.length > 0) {
        dispatch(addRuleVisualizations({
          reset,
          visualizations,
        }));
      } else {
        dispatch(setGettingVisualization({
          value: false,
          reset,
        }));
      }
    } else {
      dispatch(setGettingVisualization({
        value: false,
        reset,
      }));

      // eslint-disable-next-line no-alert
      alert('The API call for running rules failed. See the console for more details.');
    }
  }
};

export const toggleVisualizationMode = state => async (dispatch) => {
  if (state.editorView.inVisualizationMode) {
    dispatch(setInVisualizationMode(false));
    return;
  }
  const { selectedRuleID } = state.editorView;
  const { rules } = state.editorView;
  const collectionID = state.collectionView.collections.selectedCollectionID;
  const { collections } = state.collectionView.collections;
  const { joints } = collections.find(c => c.id === collectionID);
  const selectedJointIDs = state.editorView.selectedJoints;
  const rule = rules.find(r => r.id === selectedRuleID);
  const prerender = state.settingsSlice.usePrerenderedThumbnails;
  dispatch(setInVisualizationMode(true));
  if (selectedRuleID) {
    dispatch(setRuleToVisualize(
      rule, false, collectionID, joints, rules, selectedJointIDs, true, prerender
    ));
  }
};

export const addJointToVisualization = (state, joint) => async (dispatch) => {
  const { rules } = state.editorView;
  const { selectedRuleID } = state.editorView;
  const collectionID = state.collectionView.collections.selectedCollectionID;
  const joints = [joint];
  const selectedJointIDs = state.editorView.selectedJoints;
  const rule = rules.find(r => r.id === selectedRuleID);
  const prerender = state.settingsSlice.usePrerenderedThumbnails;
  if (selectedRuleID) {
    dispatch(setRuleToVisualize(
      rule, false, collectionID, joints, rules, selectedJointIDs, false, prerender, joint
    ));
  }
};

export const fetchLibraryRules = () => async (dispatch) => {
  getAllRules().then(rules => dispatch(fetchLibraryRulesSuccess(rules))).catch(console.log);
};

export const updateRuleName = (ruleID, newName) => async (dispatch) => {
  dispatch(setRuleBeingRenamedID(undefined));
  try {
    const { ok } = await renameRuleAPI(ruleID, newName);
    if (ok) {
      dispatch(setRuleName({
        ruleID, newName
      }));
    } else {
      // eslint-disable-next-line no-alert
      alert('The API call for renaming a rule failed. See the console for more details.');
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('The API call for renaming a rule failed. See the console for more details.');
  }
};

export const unApplyRules = (axisRuleID, rangeRuleID, collectionID, joints, prerender) => async (dispatch) => {
  dispatch(setApplyingRules(true));
  try {
    const result = await unApplyRuleAPI(axisRuleID, rangeRuleID, collectionID, joints, prerender);
    if (result.ok) {
      const json = await result.json();
      dispatch(updateArticulations({
        collectionID,
        articulations: json.map(parseRule),
      }));
    } else {
      // eslint-disable-next-line no-alert
      alert('The API call for un-applying a rule failed. See the console for more details.');
    }
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert('The API call for un-applying a rule failed. See the console for more details.');
    console.error(err);
  } finally {
    dispatch(setApplyingRules(false));
  }
};
