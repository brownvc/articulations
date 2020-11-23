import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rulePropType from './rulePropType';
import { setRuleBeingRenamedID, updateRuleName } from './editorSlice';
import RenameModal from '../../components/RenameModal';

const EditRuleNameModal = ({
  ruleID, rules, hide, rename
}) => {
  if (!ruleID) {
    return null;
  }
  const rule = rules.find(r => r.id === ruleID);
  if (!rule) {
    return null;
  }
  return (
    <RenameModal
      show
      title={`Rename Rule ${rule.name} (ID: ${rule.id})`}
      placeholder="Rule Name"
      onSubmit={name => rename(ruleID, name)}
      onHide={hide}
    />
  );
};

EditRuleNameModal.propTypes = {
  ruleID: PropTypes.number,
  rules: PropTypes.arrayOf(rulePropType.isRequired),
  hide: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
};

EditRuleNameModal.defaultProps = {
  ruleID: undefined,
  rules: [],
};

const mapStateToProps = state => ({
  ruleID: state.editorView.ruleBeingRenamedID,
  rules: state.editorView.rules,
});

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(setRuleBeingRenamedID(undefined)),
  rename: (ruleID, newName) => dispatch(updateRuleName(ruleID, newName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditRuleNameModal);
