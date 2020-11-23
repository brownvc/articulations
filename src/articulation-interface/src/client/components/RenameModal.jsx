import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

const RenameModal = ({
  show, title, placeholder, onSubmit, onHide
}) => {
  const [name, setName] = useState('');
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit(name);
            }
          }}
          onChange={e => setName(e.target.value)}
          value={name}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSubmit(name)} disabled={!name}>Rename</Button>
      </Modal.Footer>
    </Modal>
  );
};

RenameModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default RenameModal;
