import React from 'react';
import PropTypes from 'prop-types';

// This is the header for the different views/components that are shown.
const ViewHeader = (props) => {
  const { children } = props;
  return (
    <h3 className="m-2">{children}</h3>
  );
};

ViewHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ViewHeader;
