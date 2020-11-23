import PropTypes from 'prop-types';
import Constants from '../util/Constants';
import rulePropType from '../features/editorView/rulePropType';
import postWithUsername from './postWithUsername';
import { capitalize } from '../util/stringTools';

// Parses a single rule.
const ruleToRulePropType = rule => ({
  id: rule.rule_id ? parseInt(rule.rule_id, 10) : parseInt(rule.id, 10),
  name: rule.rule_name || rule.name,
  type: capitalize(rule.rule_type || rule.type),
  text: rule.rule_text || rule.text,
  motionType: capitalize(rule.rule_motion_type || rule.motion_type),
  createdBy: rule.created_by,
  isLibraryRule: rule.library_rule,
});

// Calls the server's API to add a new rule to a collection.
const addRuleToCollection = (collectionID, ruleName, ruleType, motionType, ruleText, addToLibrary) => postWithUsername(`${Constants.baseURL}/articulation-program/collection/rule`, {
  collection_id: collectionID,
  rule_name: ruleName,
  rule_type: ruleType,
  rule_text: ruleText,
  motion_type: motionType,
  library_rule: addToLibrary,
}).then(r => (r.ok ? r.json() : undefined))
  .then(json => (json && json.result ? ruleToRulePropType(json.result) : undefined));

// Calls the server's API to add an existing to a collection.
const addLibraryRuleToCollectionAPI = (collectionID, ruleID) => postWithUsername(`${Constants.baseURL}/articulation-program/collection/rule`, {
  collection_id: collectionID,
  rule_id: ruleID,
}).then(r => (r.ok ? r.json() : undefined))
  .then(json => (json ? ruleToRulePropType(json.result) : undefined));

// Calls the server's API to remove a part from a collection.
const deleteRuleFromCollectionAPI = (collectionID, ruleID, deleteFromLibrary) => postWithUsername(`${Constants.baseURL}/articulation-program/collection/rule`, {
  collection_id: collectionID,
  rule_id: ruleID,
  remove_from_library: deleteFromLibrary,
}, 'DELETE');

// Calls the server's API to delete a rule.
const deleteRuleAPI = ruleID => postWithUsername(`${Constants.baseURL}/articulation-program/rule`, {
  id: ruleID,
}, 'DELETE').then(r => r.ok);

// Parses the rules sent by the server calls below.
const parseRules = (json) => {
  const { result } = json;
  if (!Array.isArray(result)) {
    throw new TypeError('Did not receive an array when fetching rules.');
  }

  // Converts applicable fields to number.
  // The collection ID is excluded from the rules since it's redundant.
  // For each property, the function accepts a name with the prefix rule_.
  // This is necessary because the API calls are inconsistent.
  const rules = result.map(ruleToRulePropType);

  // Validates the rules.
  PropTypes.checkPropTypes(PropTypes.arrayOf(rulePropType).isRequired, rules, 'rules', 'getRulesForCollection');
  return rules;
};

// Calls the server's API to get all rules for a collection.
// The response is a list of rules.
const getRulesForCollection = collectionID => fetch(`${Constants.baseURL}/articulation-program/collection/rule?collection_id=${collectionID}`)
  .then(r => r.json())
  .then(parseRules);

// Calls the server's API to get a specific rule.
// The reponse is a list of rules.
const constructGetRuleArgument = ruleID => (ruleID ? `?rule_id=${ruleID}` : '');
const getRule = ruleID => fetch(`${Constants.baseURL}/articulation-program/rule${constructGetRuleArgument(ruleID)}`)
  .then(r => r.json())
  .then(parseRules);

// Calls the server's API to get all rules.
// The response is a list of rules.
const getAllRules = () => getRule(undefined);

// Calls the server's API to change a rule's name and/or text.
const updateRuleAPI = (ruleID, newRuleName, newRuleText) => {
  const body = {
    id: ruleID,
  };
  if (newRuleName) {
    body.name = newRuleName;
  }
  if (newRuleText) {
    body.content = newRuleText;
  }
  return postWithUsername(`${Constants.baseURL}/articulation-program/rule`, body, 'PUT').then(r => r.ok);
};

// Calls the server's API to run multiple rules at once.
const applyRulesAPI = (collectionID, axisRuleID, rangeRuleID, joints, useAcceptInstead, prerender) => {
  const body = {
    collection_id: collectionID,
    prerender,
    parts: joints.map(joint => ({
      moving_part_id: joint.moving_part_id,
      base_part_id: joint.base_part_id,
    })),
  };
  if (axisRuleID) {
    body.axis_rule_id = axisRuleID;
  }
  if (rangeRuleID) {
    body.range_rule_id = rangeRuleID;
  }
  return postWithUsername(useAcceptInstead ? `${Constants.baseURL}/articulation-program/collection/rule/accept` : `${Constants.baseURL}/articulation-program/collection/joints/rule`, body);
};

// Calls the server's API to suggest rules.
const suggestRulesAPI = (collectionID, joints, ruleType, prerender) => {
  const body = {
    collection_id: collectionID,
    rule_type: ruleType,
    prerender,
    parts: joints.map(joint => ({
      moving_part_id: joint.moving_part_id,
      base_part_id: joint.base_part_id,
    })),
  };
  return postWithUsername(`${Constants.baseURL}/articulation-program/collection/rule/suggestions`, body).then(r => (r.ok ? r.json() : undefined));
};

const runRulesAPI = (collectionID, axisRuleID, rangeRuleID, joints, prerender) => {
  const body = {
    collection_id: collectionID,
    axis_rule_id: axisRuleID,
    range_rule_id: rangeRuleID,
    prerender,
    parts: joints.map(joint => ({
      moving_part_id: joint.moving_part_id,
      base_part_id: joint.base_part_id,
    })),
  };
  return postWithUsername(`${Constants.baseURL}/articulation-program/collection/joint/rule/motion`, body);
};

const rejectRuleSuggestionAPI = async (
  collectionID, basePartID, movingPartID, axisRuleID, rangeRuleID
) => {
  try {
    const body = {
      collection_id: collectionID,
      moving_part_id: movingPartID,
      base_part_id: basePartID,
    };
    if (axisRuleID) {
      body.axis_rule_id = axisRuleID;
    }
    if (rangeRuleID) {
      body.range_rule_id = rangeRuleID;
    }
    const { ok } = await postWithUsername(`${Constants.baseURL}/articulation-program/collection/rule/reject`, body);
    if (!ok) {
      alert("Sending a rule suggestion's rejection to the learner failed. See the console for more details.");
    }
  } catch (err) {
    alert("Sending a rule suggestion's rejection to the learner failed. See the console for more details.");
  }
};

const renameRuleAPI = async (ruleID, newName) => postWithUsername(`${Constants.baseURL}/articulation-program/rule`, {
  id: ruleID,
  name: newName,
}, 'PUT');

const unApplyRuleAPI = async (axisRuleID, rangeRuleID, collectionID, joints, prerender) => postWithUsername(`${Constants.baseURL}/articulation-program/collection/joints/rule`, {
  collection_id: collectionID,
  prerender,
  parts: joints.map(joint => ({
    moving_part_id: joint.moving_part_id,
    base_part_id: joint.base_part_id,
  })),
  axis_rule_id: axisRuleID,
  range_rule_id: rangeRuleID,
}, 'DELETE');

export {
  addRuleToCollection,
  deleteRuleFromCollectionAPI,
  deleteRuleAPI,
  getRulesForCollection,
  getRule,
  getAllRules,
  updateRuleAPI,
  addLibraryRuleToCollectionAPI,
  applyRulesAPI,
  suggestRulesAPI,
  runRulesAPI,
  rejectRuleSuggestionAPI,
  renameRuleAPI,
  unApplyRuleAPI,
};
