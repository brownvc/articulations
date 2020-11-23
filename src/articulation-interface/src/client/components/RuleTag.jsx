import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import SimpleToolTip from './SimpleTooltip';
import jointPropType, { makeJointID } from '../features/collectionView/jointPropType';
import { hideRuleSuggestion, applyRules, unApplyRules } from '../features/editorView/editorSlice';
import { rejectRuleSuggestionAPI } from '../api/rules';

const RuleTag = (props) => {
  const {
    ruleID, ruleType, isSuggestion, joint, reject, apply, selectedCollectionID, collectionJoints,
    hideSuggestion, unApply, inProgress, prerender, ...otherProps
  } = props;
  const icon = ruleType === 'range' ? <DataUsageIcon fontSize="small" className="mr-1" /> : <ArrowRightAltIcon fontSize="small" className="mr-1" />;
  const formattedRuleType = ruleType.charAt(0).toUpperCase() + ruleType.slice(1);

  const axisRuleID = ruleType === 'range' ? collectionJoints.find(j => makeJointID(j) === makeJointID(joint)).articulation.axisRuleID : ruleID;
  const rangeRuleID = ruleType === 'range' ? ruleID : undefined;

  const [hovered, setHovered] = useState(false);

  // Applies the rule.
  const acceptSuggestion = (e) => {
    e.stopPropagation();

    // This gets rid of the suggestion in the UI.
    hideSuggestion(joint);

    // This applies the suggestion.
    apply(selectedCollectionID, axisRuleID, rangeRuleID, [joint], prerender);
  };

  // Removes the suggestion.
  const rejectSuggestion = (e) => {
    e.stopPropagation();
    reject(selectedCollectionID, joint, rangeRuleID ? undefined : axisRuleID, rangeRuleID);
  };

  // Removes the rule.
  const removeRule = (e) => {
    e.stopPropagation();
    if (!inProgress) {
      unApply(axisRuleID, rangeRuleID, selectedCollectionID, [joint], prerender);
    }
  };

  const icons = () => {
    if (isSuggestion) {
      return (
        <>
          <CheckIcon className="ml-1 cursor-pointer" onClick={acceptSuggestion} />
          <ClearIcon className="cursor-pointer" onClick={rejectSuggestion} />
        </>
      );
    } if (hovered) {
      return <ClearIcon className="cursor-pointer ml-2" onClick={removeRule} />;
    }
    return null;
  };

  return (
    <SimpleToolTip text={`${formattedRuleType} rule ${ruleID} is ${isSuggestion ? 'suggested for' : 'assigned to'} this joint.`}>
      <Badge
        variant={isSuggestion ? 'warning' : 'dark'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...otherProps}
      >
        <div className="d-flex flex-row align-items-center">
          {icon}
          {ruleID}
          {icons()}
        </div>
      </Badge>
    </SimpleToolTip>
  );
};

RuleTag.propTypes = {
  isSuggestion: PropTypes.bool,
  ruleID: PropTypes.number.isRequired,
  ruleType: PropTypes.oneOf(['axis', 'range']).isRequired,
  joint: jointPropType.isRequired,
  apply: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  hideSuggestion: PropTypes.func.isRequired,
  selectedCollectionID: PropTypes.number.isRequired,
  collectionJoints: PropTypes.arrayOf(jointPropType),
  unApply: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  prerender: PropTypes.bool.isRequired,
};

RuleTag.defaultProps = {
  isSuggestion: false,
  collectionJoints: [],
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    selectedCollectionID,
    collectionJoints: collections.find(c => c.id === selectedCollectionID).joints,
    inProgress: state.collectionView.collections.applyingRules,
    prerender: state.settingsSlice.usePrerenderedThumbnails,
  };
};

const mapDispatchToProps = dispatch => ({
  reject: (collectionID, joint, axisRuleID, rangeRuleID) => {
    rejectRuleSuggestionAPI(
      collectionID, joint.base_part_id, joint.moving_part_id, axisRuleID, rangeRuleID
    );
    dispatch(hideRuleSuggestion(makeJointID(joint)));
  },
  hideSuggestion: (joint) => {
    dispatch(hideRuleSuggestion(makeJointID(joint)));
  },
  apply: (collectionID, axisRuleID, rangeRuleID, joints, prerender) => dispatch(
    applyRules(collectionID, axisRuleID, rangeRuleID, joints, true, prerender)
  ),
  unApply: (axisRuleID, rangeRuleID, collectionID, joints, prerender) => dispatch(
    unApplyRules(axisRuleID, rangeRuleID, collectionID, joints, prerender)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleTag);
