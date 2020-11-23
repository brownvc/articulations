import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const SimpleTooltip = (props) => {
  const { text, children, disabled } = props;

  if (disabled) {
    return children;
  }

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip>{text}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );
};

SimpleTooltip.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.element.isRequired]).isRequired,
  children: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
};

SimpleTooltip.defaultProps = {
  disabled: false,
};

export default SimpleTooltip;
