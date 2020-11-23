/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import { setLibraryRuleBeingDeletedID, addLibraryRuleToCollection } from './editorSlice';
import rulePropType, { isDefaultRule } from './rulePropType';
import MotionTypeIcon from '../../components/MotionTypeIcon';
import '../../components/util.scss';

const LibraryRule = (props) => {
  const {
    rule, removeRule, selectedCollectionID, addRule, collectionRules, index
  } = props;

  const alreadyInCollection = (collectionRules.find(r => r.id === rule.id) !== undefined);

  // Sets up the hover state.
  const [hovering, setHovering] = useState(false);

  // The handlers are needed to prevent both delete and add from being triggered.
  let addDisabled = false;
  const deleteHandler = () => {
    addDisabled = true;
    removeRule(rule.id);
  };
  const addHandler = (e) => {
    if (!addDisabled && !alreadyInCollection) {
      addRule(selectedCollectionID, rule.id, !e.altKey);
    }
  };

  // Finds the last thing between triple single quotes.
  // The spaces make sure this works if the text starts or ends with triple single quotes.
  const bits = ` ${rule.text} `.split("'''");
  const docString = bits && bits.length >= 3 ? bits[bits.length - 2] : undefined;
  return (
    <div
      className={`w-100 d-flex flex-row p-1 align-items-center cursor-pointer ${index === 0 ? '' : 'border-top'} ${alreadyInCollection ? 'text-secondary' : ''}`}
      onClick={addHandler}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="d-flex flex-column flex-grow-1 flex-basis-0 px-1">
        <div>{`${rule.name || '(unnamed rule)'}`}</div>
        {docString ? <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{docString}</div> : null}
      </div>
      <div className="d-flex flex-grow-1 flex-basis-0 px-1">
        {rule.id}
      </div>
      <div className="d-flex flex-grow-1 flex-basis-0 px-1">
        <MotionTypeIcon motionType={rule.motionType} className="mr-1" />
        {rule.motionType || '(unspecified)'}
      </div>
      <div className="d-flex flex-grow-1 flex-basis-0 px-1 flex-row justify-content-between align-items-center">
        {isDefaultRule(rule) ? <Badge variant="secondary">Default Rule</Badge> : <Badge variant="primary">Library Rule</Badge>}
        {hovering && !isDefaultRule(rule) ? <DeleteIcon className="text-dark" onClick={deleteHandler} /> : null}
      </div>
    </div>
  );
};

LibraryRule.propTypes = {
  rule: rulePropType.isRequired,
  removeRule: PropTypes.func.isRequired,
  selectedCollectionID: PropTypes.number,
  addRule: PropTypes.func.isRequired,
  collectionRules: PropTypes.arrayOf(rulePropType),
  index: PropTypes.number.isRequired,
};

LibraryRule.defaultProps = {
  selectedCollectionID: undefined,
  collectionRules: []
};

const mapStateToProps = state => ({
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  collectionRules: state.editorView.rules,
});

const mapDispatchToProps = dispatch => ({
  removeRule: ruleID => dispatch(setLibraryRuleBeingDeletedID(ruleID)),
  addRule: (collectionID, ruleID, closeModal) => dispatch(addLibraryRuleToCollection(collectionID, ruleID, closeModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LibraryRule);
