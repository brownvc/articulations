import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeletionWarning from '../notification/DeletionWarning';
import { setLibraryRuleBeingDeletedID, deleteRule } from './editorSlice';
import rulePropType from './rulePropType';

const CollectionDeletionWarning = ({ rule, close, confirm }) => (
  <DeletionWarning
    title="Delete Library Rule"
    message="Are you sure you want to delete this library rule?"
    confirm={() => confirm(rule.id)}
    close={close}
    show={!!rule}
  />
);

CollectionDeletionWarning.propTypes = {
  rule: rulePropType,
  close: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
};

CollectionDeletionWarning.defaultProps = {
  rule: undefined,
};

const mapState = (state) => {
  const { libraryRuleBeingDeletedID, rules } = state.editorView;
  return {
    rule: (rules || []).find(r => r.id === libraryRuleBeingDeletedID),
  };
};

const mapDispatch = dispatch => ({
  close: () => dispatch(setLibraryRuleBeingDeletedID(undefined)),
  confirm: ruleID => dispatch(deleteRule(ruleID)),
});

export default connect(mapState, mapDispatch)(CollectionDeletionWarning);
