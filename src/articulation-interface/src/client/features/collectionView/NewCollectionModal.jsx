import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
import { cancelCreateNewCollection, createNewCollection } from './collectionsSlice';

const mapStateToProps = state => ({
  show: state.collectionView.collections.creatingNewCollection,
});

const mapDispatchToProps = dispatch => ({
  cancelCreation: () => dispatch(cancelCreateNewCollection()),
  createCollection: name => dispatch(createNewCollection(name)),
});

const NewCollectionModal = (props) => {
  const { show, cancelCreation, createCollection } = props;
  const nameRef = React.createRef();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  });

  return (
    <Modal show={show} onHide={cancelCreation}>
      <Modal.Header closeButton>
        <Modal.Title>New Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          autoFocus
          placeholder="Collection Name"
          ref={nameRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createCollection(nameRef.current.value);
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => createCollection(nameRef.current.value)}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
};

NewCollectionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  cancelCreation: PropTypes.func.isRequired,
  createCollection: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCollectionModal);
