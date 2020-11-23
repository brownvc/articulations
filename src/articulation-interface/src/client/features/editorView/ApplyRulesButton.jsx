import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  DropdownButton, Button, Dropdown, Spinner
} from 'react-bootstrap';
import jointPropType, { makeJointID } from '../collectionView/jointPropType';
import SimpleTooltip from '../../components/SimpleTooltip';
import { applyRules } from './editorSlice';
import rulePropType from './rulePropType';
import { showNotification } from '../notification/notificationSlice';
import MotionTypeIcon from '../../components/MotionTypeIcon';
import { capitalize } from '../../util/stringTools';
import '../../components/util.scss';

const ApplyRulesButton = (props) => {
  const {
    selectedJoints, collectionJoints, apply, selectedCollectionID, collectionRules, inProgress,
    inVisualizationMode, message, showAttributes, prerender, ...otherProps
  } = props;

  // Makes an API call for each rule that's run.
  const handleClick = (ruleID, type) => {
    const rule = collectionRules.find(r => r.id === ruleID);
    const selectedJointsSet = new Set(selectedJoints);
    const joints = collectionJoints.filter(joint => selectedJointsSet.has(makeJointID(joint)));
    let ruleTypeMismatch = false;
    let axisRangeOrderMismatch = false;
    const allowedJoints = joints.filter((joint) => {
      const jointMotionType = (joint.articulation.motionType || '').toUpperCase();
      const ruleMotionType = (rule.motionType || '').toUpperCase();
      const motionTypeMismatch = jointMotionType && ruleMotionType !== jointMotionType;
      const hasAxisRule = joint.articulation && joint.articulation.axisRuleID;

      // Checks for rule type mismatch.
      if (motionTypeMismatch && type === 'Range') {
        ruleTypeMismatch = true;
        return false;
      }

      // Gives the user a message if they're in attribute visualization mode still.
      if (Object.values(showAttributes).find(v => v === true)) {
        message('Warning: You must stop previewing joint attributes (via the yellow dropdown) to see the articulations produced by applied rules.');
      }

      // Checks for assignment of range rules to joints without axis rules.
      const allowed = (type === 'Axis') || (hasAxisRule && type === 'Range');
      axisRangeOrderMismatch = axisRangeOrderMismatch || !allowed;
      return allowed;
    });
    if (allowedJoints.length > 0) {
      if (type === 'Axis') {
        // It's an axis rule.
        apply(
          selectedCollectionID,
          ruleID,
          undefined,
          allowedJoints,
          prerender,
        );
      } else {
        // It's a range rule.
        apply(
          selectedCollectionID,
          undefined,
          ruleID,
          allowedJoints,
          prerender,
        );
      }
    }

    // Builds the message that the user gets.
    if (ruleTypeMismatch || axisRangeOrderMismatch) {
      const base = 'The selected rule was not applied to all selected joints.';
      const ruleTypeMessage = 'The rule type (translation or rotation) of axis and range rules must match.';
      const axisRangeOrderMessage = 'a joint must have an axis rule before being assigned a range rule.';
      if (ruleTypeMismatch && axisRangeOrderMismatch) {
        message(`${base} ${ruleTypeMessage} Additionally, ${axisRangeOrderMessage}`);
      } else if (ruleTypeMismatch) {
        message(`${base} ${ruleTypeMessage}`);
      } else if (axisRangeOrderMismatch) {
        message(`${base} ${capitalize(axisRangeOrderMessage)}`);
      }
    }
  };

  // Makes a dropdown item for each axis rule.
  const axisItems = [<Dropdown.Header key="Axis Rules">Axis Rules</Dropdown.Header>];
  const rangeItems = [<Dropdown.Header key="Range Rules">Range Rules</Dropdown.Header>];
  collectionRules.forEach((rule) => {
    const item = (
      <Dropdown.Item key={rule.id} onClick={() => handleClick(rule.id, rule.type)}>
        <MotionTypeIcon motionType={rule.motionType} className="mr-2" />
        {`${rule.name || '(unnamed rule)'} (ID: ${rule.id})`}
      </Dropdown.Item>
    );
    if (rule.type === 'Axis') {
      axisItems.push(item);
    } else {
      rangeItems.push(item);
    }
  });
  let dropdownItems;
  if (axisItems.length > 1 && rangeItems.length > 1) {
    dropdownItems = [...axisItems, <Dropdown.Divider key="Divider" />, ...rangeItems];
  } else if (axisItems.length > 1) {
    dropdownItems = axisItems;
  } else if (rangeItems.length > 1) {
    dropdownItems = rangeItems;
  }

  // TODO: Fix the tooltip issue and reenable the tooltip.
  return (
    <>
      <DropdownButton
        className="m-1"
        size="sm"
        variant="secondary"
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
            Apply Rule
          </>
        )}
        disabled={
          !selectedJoints.length || inProgress || inVisualizationMode || !collectionRules.length
        }
        {...otherProps}
      >
        <div className="overflow-scroll" style={{ maxHeight: '400px' }}>
          {dropdownItems}
        </div>
      </DropdownButton>

      <SimpleTooltip text="Hover over rules to unapply them.">
        <Button variant="secondary" size="sm" className="m-1">Unapply&nbsp;Rule</Button>
      </SimpleTooltip>
    </>
  );
};

ApplyRulesButton.propTypes = {
  collectionRules: PropTypes.arrayOf(rulePropType),
  collectionJoints: PropTypes.arrayOf(jointPropType),
  selectedJoints: PropTypes.arrayOf(PropTypes.string.isRequired),
  selectedCollectionID: PropTypes.number.isRequired,
  apply: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  message: PropTypes.func.isRequired,
  showAttributes: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  prerender: PropTypes.bool.isRequired,
};

ApplyRulesButton.defaultProps = {
  collectionRules: [],
  collectionJoints: [],
  selectedJoints: [],
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    collectionJoints: collections.find(c => c.id === selectedCollectionID).joints,
    collectionRules: state.editorView.rules,
    selectedJoints: state.editorView.selectedJoints,
    selectedCollectionID: state.collectionView.collections.selectedCollectionID,
    inProgress: state.collectionView.collections.applyingRules,
    inVisualizationMode: state.editorView.inVisualizationMode,
    showAttributes: state.jointAttributesSlice.show,
    prerender: state.settingsSlice.usePrerenderedThumbnails,
  };
};

const mapDispatchToProps = dispatch => ({
  apply: (collectionID, axisRuleID, rangeRuleID, joints, prerender) => dispatch(
    applyRules(collectionID, axisRuleID, rangeRuleID, joints, false, prerender)
  ),
  message: text => dispatch(showNotification(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplyRulesButton);
