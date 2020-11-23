import React from 'react';
import PropTypes from 'prop-types';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SimpleTooltip from './SimpleTooltip';

const MotionTypeIcon = (props) => {
  const { motionType, ...otherProps } = props;

  if (motionType === 'Translation') {
    return <SimpleTooltip text="Translation Rule"><SwapHorizIcon {...otherProps} /></SimpleTooltip>;
  }
  if (motionType === 'Rotation') {
    return <SimpleTooltip text="Rotation Rule"><AutorenewIcon {...otherProps} /></SimpleTooltip>;
  }

  // If the motion type is invalid, no icon appears.
  return null;
};

MotionTypeIcon.propTypes = {
  motionType: PropTypes.oneOf(['Translation', 'Rotation']),
};

MotionTypeIcon.defaultProps = {
  motionType: undefined,
};

export default MotionTypeIcon;
