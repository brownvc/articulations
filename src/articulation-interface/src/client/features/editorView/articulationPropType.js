import PropTypes from 'prop-types';

const articulationPropType = PropTypes.shape({
  pid: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['Central Rotation', 'Hinge Rotation', 'Translation']),
  origin: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }),
  axis: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }),
  base: PropTypes.arrayOf(PropTypes.number.isRequired),
  rangeMin: PropTypes.number.isRequired,
  rangeMax: PropTypes.number.isRequired,
});

export default articulationPropType;
