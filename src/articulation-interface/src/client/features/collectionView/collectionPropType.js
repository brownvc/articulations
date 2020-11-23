import { PropTypes } from 'prop-types';
import jointPropType from './jointPropType';

const collectionPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  joints: PropTypes.arrayOf(jointPropType.isRequired),
});

export default collectionPropType;
