import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownButton, Dropdown, Spinner } from 'react-bootstrap';
import jointPropType, { makeJointID } from '../collectionView/jointPropType';
import SimpleTooltip from '../../components/SimpleTooltip';
import { suggestRules } from './editorSlice';
import rulePropType from './rulePropType';

const SuggestRulesButton = (props) => {
  const {
    selectedJoints, collectionJoints, suggest, selectedCollectionID, inProgress,
    inVisualizationMode, collectionRules, prerender, ...otherProps
  } = props;

  // Creates maps of joint ID to joint for joints without axis/range rules.
  const jointsWithoutAxes = new Map();
  const jointsWithoutRanges = new Map();
  collectionJoints.filter(joint => joint.articulation).forEach((joint) => {
    const { articulation } = joint;
    const jointID = makeJointID(joint);
    if (!articulation.axisRuleID) {
      jointsWithoutAxes.set(jointID, joint);
    } else if (!articulation.rangeRuleID) {
      jointsWithoutRanges.set(jointID, joint);
    }
  });

  // Figures out if the selection includes joints from the above set.
  let canSuggestAxes = false;
  let canSuggestRanges = false;
  selectedJoints.find((jointID) => {
    if (jointsWithoutAxes.has(jointID)) {
      canSuggestAxes = true;
    }
    if (jointsWithoutRanges.has(jointID)) {
      canSuggestRanges = true;
    }

    // This short-circuits the search if both buttons should be enabled.
    return canSuggestAxes && canSuggestRanges;
  });

  // If there are no axis or range rules, disables that option.
  let axisRulesExist = false;
  let rangeRulesExist = false;
  collectionRules.find((rule) => {
    axisRulesExist = axisRulesExist || rule.type === 'Axis';
    rangeRulesExist = rangeRulesExist || rule.type === 'Range';

    // This short-circuits the search if both axis and range rules exist.
    return axisRulesExist && rangeRulesExist;
  });

  // Figures out the button state.
  canSuggestAxes = canSuggestAxes && axisRulesExist;
  canSuggestRanges = canSuggestRanges && rangeRulesExist;
  const buttonEnabled = canSuggestAxes || canSuggestRanges;

  // Gets all possible axis suggestions.
  const runAxis = () => {
    const joints = selectedJoints.filter(jointID => jointsWithoutAxes.has(jointID))
      .map(jointID => jointsWithoutAxes.get(jointID));
    suggest(selectedCollectionID, joints, 'Axis', prerender);
  };

  // Gets all possible range suggestions.
  const runRange = () => {
    const joints = selectedJoints.filter(jointID => jointsWithoutRanges.has(jointID))
      .map(jointID => jointsWithoutRanges.get(jointID));
    suggest(selectedCollectionID, joints, 'Range', prerender);
  };

  // Picks the tooltip text.
  let tooltipText = 'Select a joint that does not have both axis and range rules to suggest rules.';
  if (inVisualizationMode) {
    tooltipText = 'Suggesting rules is disabled in visualization mode.';
  }

  // TODO: Fix the tooltip issue and reenable the tooltip.
  return (
    <SimpleTooltip text={tooltipText} disabled={!(inVisualizationMode || !buttonEnabled) || true}>
      <span>
        <DropdownButton
          title={(
            <>
              {
                inProgress ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mr-2"
                  />
                ) : null
              }
              Suggest Rules
            </>
          )}
          disabled={!buttonEnabled || inProgress || inVisualizationMode}
          {...otherProps}
        >
          {canSuggestAxes ? <Dropdown.Item onClick={runAxis}>Axis Rules</Dropdown.Item> : null}
          {canSuggestRanges ? <Dropdown.Item onClick={runRange}>Range Rules</Dropdown.Item> : null}
        </DropdownButton>
      </span>
    </SimpleTooltip>
  );
};

SuggestRulesButton.propTypes = {
  selectedCollectionID: PropTypes.number.isRequired,
  collectionJoints: PropTypes.arrayOf(jointPropType),
  collectionRules: PropTypes.arrayOf(rulePropType),
  selectedJoints: PropTypes.arrayOf(PropTypes.string.isRequired),
  suggest: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  prerender: PropTypes.bool.isRequired,
};

SuggestRulesButton.defaultProps = {
  collectionRules: [],
  collectionJoints: [],
  selectedJoints: [],
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    collectionJoints: collections.find(c => c.id === selectedCollectionID).joints,
    collectionRules: state.editorView.rules,
    inProgress: state.editorView.fetchingRuleSuggestions,
    selectedCollectionID: state.collectionView.collections.selectedCollectionID,
    selectedJoints: state.editorView.selectedJoints,
    inVisualizationMode: state.editorView.inVisualizationMode,
    prerender: state.settingsSlice.usePrerenderedThumbnails,
  };
};

const mapDispatchToProps = dispatch => ({
  suggest: (collectionID, joints, ruleType, prerender) => dispatch(
    suggestRules(collectionID, joints, ruleType, prerender)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestRulesButton);
