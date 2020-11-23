import PropTypes from 'prop-types';

const xyz = PropTypes.arrayOf(PropTypes.number.isRequired).isRequired;
const attributePropType = PropTypes.shape({
  base_axis1_bottom: xyz,
  base_axis1_direction: xyz,
  base_axis1_length: PropTypes.number.isRequired,
  base_axis1_top: xyz,

  base_axis2_bottom: xyz,
  base_axis2_direction: xyz,
  base_axis2_length: PropTypes.number.isRequired,
  base_axis2_top: xyz,

  base_axis3_bottom: xyz,
  base_axis3_direction: xyz,
  base_axis3_length: PropTypes.number.isRequired,
  base_axis3_top: xyz,

  base_center: xyz,

  contact_center: xyz,

  moving_axis1_bottom: xyz,
  moving_axis1_direction: xyz,
  moving_axis1_length: PropTypes.number.isRequired,
  moving_axis1_top: xyz,

  moving_axis2_bottom: xyz,
  moving_axis2_direction: xyz,
  moving_axis2_length: PropTypes.number.isRequired,
  moving_axis2_top: xyz,

  moving_axis3_bottom: xyz,
  moving_axis3_direction: xyz,
  moving_axis3_length: PropTypes.number.isRequired,
  moving_axis3_top: xyz,

  moving_center: xyz,
});

export default attributePropType;
