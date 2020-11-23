import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { setEndingSession, endSession } from './sessionSlice';

const EndSessionModal = ({
  endingSession, exit, end, sessionID
}) => {
  const [name, setName] = useState(undefined);
  const commentRef = createRef();

  return (
    <Modal show={endingSession} onHide={exit}>
      <Modal.Header closeButton>
        <Modal.Title>End Session</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setName(undefined);
          end(sessionID, name, commentRef.current.value);
        }}
      >
        <Modal.Body>
          <Form.Control placeholder="Session Name" value={name} onChange={e => setName(e.target.value)} className="mb-2" />
          <Form.Control as="textarea" rows="3" placeholder="Comments" ref={commentRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={!name}>Save Session</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

EndSessionModal.propTypes = {
  endingSession: PropTypes.bool.isRequired,
  sessionID: PropTypes.number,
  exit: PropTypes.func.isRequired,
  end: PropTypes.func.isRequired,
};

EndSessionModal.defaultProps = {
  sessionID: undefined,
};

const mapStateToProps = state => ({
  sessionID: state.sessionSlice.sessionID,
  endingSession: state.sessionSlice.endingSession,
});

const mapDispatchToProps = dispatch => ({
  exit: () => dispatch(setEndingSession(false)),
  end: (sessionID, name, comment) => dispatch(endSession(sessionID, name, comment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EndSessionModal);
