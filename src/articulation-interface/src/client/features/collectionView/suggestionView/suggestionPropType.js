import PropTypes from 'prop-types';
import jointPropType from '../jointPropType';

const suggestionPropType = PropTypes.shape({
  collection_id: PropTypes.number.isRequired,
  decision: PropTypes.bool.isRequired,
  joint: jointPropType.isRequired,
});

export default suggestionPropType;
