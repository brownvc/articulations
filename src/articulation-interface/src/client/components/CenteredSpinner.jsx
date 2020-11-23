import React from 'react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CenteredSpinner = (props) => {
  const { message } = props;

  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <div>
        <Spinner animation="border" />
        {
          message === null ? null : <div>{`${message}`}</div>
        }
      </div>
    </div>
  );
};

CenteredSpinner.propTypes = {
  message: PropTypes.string,
};

CenteredSpinner.defaultProps = {
  message: null,
};

export default CenteredSpinner;
