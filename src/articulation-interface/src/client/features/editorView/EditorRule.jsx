/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MotionTypeIcon from '../../components/MotionTypeIcon';
import rulePropType, { ruleTypeText, isDefaultRule } from './rulePropType';
import {
  startRemoveRuleFromCollection, toggleRuleSelection, removeRuleFromCollection,
  setInVisualizationMode, setRuleBeingRenamedID, setRuleToDuplicate,
} from './editorSlice';
import '../../components/util.scss';

const EditorRule = (props) => {
  const {
    rule, odd, selectedCollectionID, remove, selectedRuleID, toggle, unsavedStatuses,
    inVisualizationMode, endVisualization, visualizationInProgress, removeDefault, rename,
    ruleErrors, duplicate
  } = props;
  const [hovering, setHovering] = useState(false);

  // The handlers are needed to prevent both delete and select from being triggered.
  let selectDisabled = false;
  const deleteHandler = () => {
    selectDisabled = true;
    if (isDefaultRule(rule)) {
      removeDefault(selectedCollectionID, rule.id);
    } else {
      remove(selectedCollectionID, rule.id);
    }
  };
  const selected = selectedRuleID === rule.id;
  const selectHandler = () => {
    if (!selectDisabled && !visualizationInProgress) {
      if (inVisualizationMode) {
        endVisualization();
      }
      toggle(rule.id);
    }
  };
  const renameHandler = () => {
    selectDisabled = true;
    rename(rule.id);
  };
  const duplicateHandler = () => {
    selectDisabled = true;
    duplicate(rule);
  };

  // Sets the style based on visualization, position, etc.
  const additionalClasses = () => {
    if (selected) {
      return `${inVisualizationMode ? 'bg-success' : 'bg-primary'} text-light`;
    }
    if (ruleErrors[rule.id] && !inVisualizationMode) {
      return 'bg-danger text-light';
    }
    if (odd) {
      return 'bg-light';
    }
    return '';
  };

  const leftSide = () => {
    const mainText = `${unsavedStatuses[rule.id] ? '• ' : ''}${rule.name || '(unnamed rule)'} (ID: ${rule.id})`;
    const textArea = (
      <div className="d-flex flex-row">
        <div>{mainText}</div>
        <div className={`${(selected || ruleErrors[rule.id]) ? '' : 'text-secondary'} mx-1`}><small>{ruleTypeText(rule)}</small></div>
      </div>
    );
    if (rule.motionType) {
      return (
        <div className="d-flex flex-row align-items-center">
          <MotionTypeIcon motionType={rule.motionType} className="mr-2" />
          {textArea}
        </div>
      );
    }
    return textArea;
  };

  return (
    <div
      className={`w-100 d-flex flex-row justify-content-between py-1 px-2 cursor-pointer ${additionalClasses()}`}
      onClick={selectHandler}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {leftSide()}
      {
        hovering ? (
          <div className="d-flex flex-row">
            {isDefaultRule(rule) ? null : <EditIcon onClick={renameHandler} />}
            <FileCopyIcon onClick={duplicateHandler} />
            <DeleteIcon onClick={deleteHandler} />
          </div>
        ) : null
      }
    </div>
  );
};

EditorRule.propTypes = {
  rule: rulePropType.isRequired,
  odd: PropTypes.bool.isRequired,
  selectedCollectionID: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  removeDefault: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  unsavedStatuses: PropTypes.objectOf(PropTypes.bool),
  inVisualizationMode: PropTypes.bool.isRequired,
  endVisualization: PropTypes.func.isRequired,
  selectedRuleID: PropTypes.number,
  visualizationInProgress: PropTypes.bool.isRequired,
  rename: PropTypes.func.isRequired,
  ruleErrors: PropTypes.objectOf(PropTypes.string),
  duplicate: PropTypes.func.isRequired,
};

EditorRule.defaultProps = {
  selectedRuleID: undefined,
  unsavedStatuses: {},
  ruleErrors: {},
};

const mapStateToProps = state => ({
  selectedRuleID: state.editorView.selectedRuleID,
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  unsavedStatuses: state.editorView.ruleUnsavedStatuses,
  inVisualizationMode: state.editorView.inVisualizationMode,
  visualizationInProgress: state.editorView.gettingVisualization,
  ruleErrors: state.editorView.ruleErrors,
});

const mapDispatchToProps = dispatch => ({
  remove: (collectionID, ruleID) => dispatch(startRemoveRuleFromCollection(collectionID, ruleID)),
  removeDefault: (collectionID, ruleID) => dispatch(
    removeRuleFromCollection(collectionID, ruleID, false)
  ),
  toggle: rule => dispatch(toggleRuleSelection(rule)),
  rename: id => dispatch(setRuleBeingRenamedID(id)),
  endVisualization: () => dispatch(setInVisualizationMode(false)),
  duplicate: rule => dispatch(setRuleToDuplicate(rule)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorRule);
