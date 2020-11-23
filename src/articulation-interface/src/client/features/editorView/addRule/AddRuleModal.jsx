import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Modal, Button, InputGroup, FormControl, Form
} from 'react-bootstrap';
import { hideAddRuleModal, addRule, fetchLibraryRules } from '../editorSlice';
import rulePropType from '../rulePropType';
import AddRuleModalRuleArea from './AddRuleModalRuleArea';
import '../../../components/util.scss';
import './AddRuleModal.scss';

const AddRuleModal = (props) => {
  const {
    ruleType, exit, create, selectedCollectionID, getRules, rules
  } = props;

  const [ruleName, setRuleName] = useState('');
  const [searchName, setSearchName] = useState('');
  const motionTypeRef = React.createRef();
  const addToLibraryRef = React.createRef();
  const searchRef = React.createRef();

  // Creates a new rule.
  const createButtonHandler = () => {
    const addToLibrary = addToLibraryRef.current.checked;
    create(selectedCollectionID, ruleName, ruleType, motionTypeRef.current.value, addToLibrary);
  };

  // Loads the rules.
  // Since the rules are made undefined every time the modal opens up,
  // this is (sort of) equivalent to loading each time the modal opens up.
  useEffect(() => {
    if (rules === undefined) {
      setSearchName('');
      getRules();
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }
  });

  return (
    <Modal
      show={!!ruleType}
      onHide={exit}
      dialogClassName="add-rule-modal"
    >
      <div className="d-flex flex-column w-100 h-100 overflow-hidden">
        <Modal.Header closeButton>
          <Modal.Title>{`Create or Import ${ruleType === 'Axis' ? 'an Axis' : 'a Range'} Rule`}</Modal.Title>
        </Modal.Header>
        <div>
          <Modal.Body>
            <h5>Create a New Rule</h5>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="New Rule Name"
                onChange={e => setRuleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && ruleName) {
                    createButtonHandler();
                  }
                }}
              />
              <InputGroup.Append>
                <Button onClick={createButtonHandler} disabled={!ruleName}>Create</Button>
              </InputGroup.Append>
            </InputGroup>
            <FormControl className="mt-2" as="select" ref={motionTypeRef}>
              <option>Rotation</option>
              <option>Translation</option>
            </FormControl>
            <Form.Check
              className="mt-2"
              type="checkbox"
              label="Add this rule to the library."
              ref={addToLibraryRef}
            />
          </Modal.Body>
        </div>

        <div className="d-flex flex-grow-1 overflow-hidden">
          <Modal.Body className="d-flex flex-column border-top overflow-hidden w-100 h-100">
            <div className="d-flex flex-row justify-content-between align-items-end mb-2">
              <div>
                <h5 className="mb-0">Import a Library Rule</h5>
                <div>Holt alt/option to add multiple library rules at once.</div>
              </div>
              <div className="d-flex flex-grow-1 ml-2">
                <Form.Control
                  placeholder="Search for rules by name."
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  ref={searchRef}
                />
              </div>
            </div>
            <div className="d-flex flex-grow-1 overflow-hidden">
              <AddRuleModalRuleArea rules={rules} ruleType={ruleType} searchName={searchName} />
            </div>
          </Modal.Body>
        </div>
      </div>
    </Modal>
  );
};

AddRuleModal.propTypes = {
  ruleType: PropTypes.oneOf(['Axis', 'Range']),
  exit: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  selectedCollectionID: PropTypes.number,
  getRules: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(rulePropType),
};

AddRuleModal.defaultProps = {
  ruleType: undefined,
  rules: undefined,
  selectedCollectionID: undefined,
};

const mapStateToProps = state => ({
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  ruleType: state.editorView.addingRuleType,
  rules: state.editorView.libraryRules,
});

const mapDispatchToProps = dispatch => ({
  getRules: collectionID => dispatch(fetchLibraryRules(collectionID)),
  exit: () => dispatch(hideAddRuleModal()),
  create: (collectionID, ruleName, ruleType, motionType, addToLibrary) => dispatch(
    addRule(collectionID, ruleName, ruleType, motionType, addToLibrary)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddRuleModal);
