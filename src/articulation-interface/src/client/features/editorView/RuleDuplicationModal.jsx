import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setRuleToDuplicate, addRule } from './editorSlice';
import rulePropType from './rulePropType';

class RuleDuplicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
    this.nameRef = createRef();
    this.addToLibraryRef = createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { rule } = this.props;
    const { name } = this.state;
    if (name === prevState.name) {
      // This section only occurs when the modal is opened.
      if (rule) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          name: `Copy of ${rule.name}`,
        });
      }
      if (this.nameRef.current) {
        this.nameRef.current.focus();
      }
    }
  }

  render() {
    const {
      rule, handleClose, add, collectionID
    } = this.props;
    const { name } = this.state;
    if (!rule) {
      return null;
    }
    return (
      <Modal show={!!rule} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`Duplicate Rule ${rule.name} (ID: ${rule.id})`}</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            add(collectionID, name, rule.type, rule.motionType,
              this.addToLibraryRef.current.checked, rule.text);
            this.setState({
              name: '',
            });
            handleClose();
          }}
        >
          <Modal.Body>
            <Form.Control
              placeholder="Rule Name"
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              className="mb-2"
              ref={this.nameRef}
            />
            <Form.Check
              label="Add duplicate to library"
              ref={this.addToLibraryRef}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={!name}>Duplicate</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

RuleDuplicationModal.propTypes = {
  rule: rulePropType,
  handleClose: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  collectionID: PropTypes.number,
};

RuleDuplicationModal.defaultProps = {
  rule: undefined,
  collectionID: undefined,
};

const mapState = state => ({
  rule: state.editorView.ruleToDuplicate,
  collectionID: state.editorView.collectionID,
});

const mapDispatch = dispatch => ({
  handleClose: () => dispatch(setRuleToDuplicate(undefined)),
  add: (collectionID, ruleName, ruleType, motionType, addToLibrary, text) => dispatch(
    addRule(collectionID, ruleName, ruleType, motionType, addToLibrary, text)
  ),
});

export default connect(mapState, mapDispatch)(RuleDuplicationModal);
