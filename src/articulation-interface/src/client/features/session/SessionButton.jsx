import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { startSession, setSessionID, setEndingSession } from './sessionSlice';

class SessionButton extends React.Component {
  constructor(props) {
    super(props);
    const { setID } = props;

    const sessionID = parseInt(localStorage.getItem('sessionID'), 10);
    if (sessionID) {
      setID(sessionID);
    }
  }

  render() {
    const {
      sessionID, start, end, ...otherProps
    } = this.props;
    if (sessionID) {
      return <Button size="sm" onClick={end} {...otherProps}>End&nbsp;Session</Button>;
    }
    return <Button size="sm" onClick={start}>Start&nbsp;Session</Button>;
  }
}

SessionButton.propTypes = {
  sessionID: PropTypes.number,
  start: PropTypes.func.isRequired,
  end: PropTypes.func.isRequired,
  setID: PropTypes.func.isRequired,
};

SessionButton.defaultProps = {
  sessionID: undefined,
};

const mapStateToProps = state => ({
  sessionID: state.sessionSlice.sessionID,
});

const mapDispatchToProps = dispatch => ({
  start: () => dispatch(startSession()),
  end: () => dispatch(setEndingSession(true)),
  setID: sessionID => dispatch(setSessionID(sessionID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SessionButton);
