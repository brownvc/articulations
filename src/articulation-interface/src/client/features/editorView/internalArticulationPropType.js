import PropTypes from 'prop-types';

const internalArticulationPropType = PropTypes.shape({
  filename: PropTypes.string,
  minRange: PropTypes.number,
  maxRange: PropTypes.number,
  motionType: PropTypes.oneOf(['Translation', 'Rotation', '']),
  axis: PropTypes.arrayOf(PropTypes.number.isRequired),
  origin: PropTypes.arrayOf(PropTypes.number.isRequired),
  axisRuleID: PropTypes.number,
  rangeRuleID: PropTypes.number,
  currentPose: PropTypes.number,
  ref: PropTypes.arrayOf(PropTypes.number.isRequired),
});

export default internalArticulationPropType;
