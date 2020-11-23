import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

const DeletionWarning = ({
  title, message, confirm, close, show
}) => (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={confirm}>Yes, delete it forever.</Button>
      </Modal.Footer>
    </Modal>
  );

DeletionWarning.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirm: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

DeletionWarning.defaultProps = {
  show: true,
};

export default DeletionWarning;
