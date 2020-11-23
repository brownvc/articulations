import React from 'react';
import PropTypes from 'prop-types';

// A label that's used in the FilterBar.
const Label = (props) => {
  const { text, className } = props;
  return (
    <div className={`d-flex flex-column justify-content-center text-light mh-100 ${className}`}>
      <div>{text}</div>
    </div>
  );
};

Label.defaultProps = {
  className: '',
};

Label.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Label;
