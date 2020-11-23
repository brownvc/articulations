import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setRuleToRemoveInfo, removeRuleFromCollection } from './editorSlice';
import rulePropType from './rulePropType';

const DeleteRuleModal = ({
  info, hide, remove, rules
}) => {
  if (!info) {
    return null;
  }
  const rule = rules.find(r => r.id === info.ruleID);

  // Chooses what the content is based on what kind of rule is being deleted.
  const content = () => {
    if (rule.isLibraryRule) {
      return (
        <>
          <Modal.Body>The rule you are trying to remove from the current collection is a library rule. Would you like to delete it from the library?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => remove(info.collectionID, info.ruleID, false)}>No, only remove from collection.</Button>
            <Button variant="danger" onClick={() => remove(info.collectionID, info.ruleID, true)}>Yes, delete from library.</Button>
          </Modal.Footer>
        </>
      );
    }
    return (
      <>
        <Modal.Body>Are you sure you want to delete this local rule? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => remove(info.collectionID, info.ruleID, true)}>Yes, delete it forever.</Button>
        </Modal.Footer>
      </>
    );
  };

  return (
    <Modal show={!!info} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>Rule Deletion</Modal.Title>
      </Modal.Header>
      {content()}
    </Modal>
  );
};

DeleteRuleModal.propTypes = {
  info: PropTypes.objectOf(PropTypes.number.isRequired),
  hide: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(rulePropType.isRequired),
};

DeleteRuleModal.defaultProps = {
  info: undefined,
  rules: [],
};

const mapStateToProps = state => ({
  info: state.editorView.ruleToRemoveInfo,
  rules: state.editorView.rules,
});

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(setRuleToRemoveInfo(undefined)),
  remove: (collectionID, ruleID, deleteFromLibrary) => dispatch(
    removeRuleFromCollection(collectionID, ruleID, deleteFromLibrary)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteRuleModal);
