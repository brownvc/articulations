import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { applyRules, hideRuleSuggestion } from './editorSlice';
import SimpleTooltip from '../../components/SimpleTooltip';
import { rejectRuleSuggestionAPI } from '../../api/rules';
import { makeJointID, splitJointID } from '../collectionView/jointPropType';
import internalArticulationPropType from './internalArticulationPropType';

const EvaluateRuleSuggestionsButton = (props) => {
  const {
    apply, reject, selectedCollectionID, suggested, prerender, inVisualizationMode, ...otherProps
  } = props;

  const disabled = inVisualizationMode || Object.entries(suggested).length === 0;

  return (
    <SimpleTooltip text="Selection is disabled in visualization mode." disabled={!inVisualizationMode}>
      <span>
        <ButtonGroup {...otherProps}>
          <Button
            variant="secondary"
            onClick={() => {
              Object.entries(suggested).forEach(([jointID, articulation]) => {
                const [basePartID, movingPartID] = splitJointID(jointID);
                apply(selectedCollectionID, articulation.axisRuleID, articulation.rangeRuleID, {
                  base_part_id: basePartID,
                  moving_part_id: movingPartID,
                }, prerender);
              });
            }}
            disabled={disabled}
          >
            Accept&nbsp;All&nbsp;Suggestions
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              Object.entries(suggested).forEach(([jointID, articulation]) => {
                const [basePartID, movingPartID] = splitJointID(jointID);
                reject(selectedCollectionID, {
                  base_part_id: basePartID,
                  moving_part_id: movingPartID,
                }, articulation.axisRuleID, articulation.rangeRuleID);
              });
            }}
            disabled={disabled}
          >
            Reject&nbsp;All&nbsp;Suggestions
          </Button>
        </ButtonGroup>
      </span>
    </SimpleTooltip>
  );
};

EvaluateRuleSuggestionsButton.propTypes = {
  selectedCollectionID: PropTypes.number.isRequired,
  apply: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  prerender: PropTypes.bool.isRequired,
  suggested: PropTypes.objectOf(internalArticulationPropType.isRequired),
};

EvaluateRuleSuggestionsButton.defaultProps = {
  suggested: {},
};

const mapStateToProps = (state) => {
  const { selectedCollectionID } = state.collectionView.collections;
  return {
    selectedCollectionID,
    suggested: state.editorView.suggestedArticulations,
    inVisualizationMode: state.editorView.inVisualizationMode,
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
  apply: (collectionID, axisRuleID, rangeRuleID, joint, prerender) => {
    dispatch(applyRules(collectionID, axisRuleID, rangeRuleID, [joint], true, prerender));
    dispatch(hideRuleSuggestion(makeJointID(joint)));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateRuleSuggestionsButton);
