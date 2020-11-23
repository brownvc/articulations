import PropTypes from 'prop-types';
import internalArticulationPropType from '../editorView/internalArticulationPropType';

const jointPropType = PropTypes.shape({
  base_part_id: PropTypes.number.isRequired,
  base_part_index: PropTypes.number.isRequired,
  moving_part_id: PropTypes.number.isRequired,
  moving_part_index: PropTypes.number.isRequired,
  full_id: PropTypes.string.isRequired,
  articulation: internalArticulationPropType,
});

export default jointPropType;

export const makeJointID = joint => `${joint.base_part_id}/${joint.moving_part_id}`;

export const simpleMakeJointID = (basePartID, movingPartID) => `${basePartID}/${movingPartID}`;

export const splitJointID = jointID => jointID.split('/').map(x => parseInt(x, 10));
