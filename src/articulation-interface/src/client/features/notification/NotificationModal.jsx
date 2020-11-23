import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { hideNotification } from './notificationSlice';

const NotificationModal = ({ message, hide }) => (
  <Modal show={!!message} onHide={hide}>
    <Modal.Header closeButton>
      <Modal.Title>Notification</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button onClick={hide}>OK</Button>
    </Modal.Footer>
  </Modal>
);

NotificationModal.propTypes = {
  message: PropTypes.string,
  hide: PropTypes.func.isRequired,
};

NotificationModal.defaultProps = {
  message: undefined,
};

const mapStateToProps = state => ({
  message: state.notificationSlice.message,
});

const mapDispatchToProps = {
  hide: hideNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationModal);
