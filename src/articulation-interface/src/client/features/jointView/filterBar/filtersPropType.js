import PropTypes from 'prop-types';

const filtersPropType = PropTypes.shape({
  objectCategory: PropTypes.string,
  dataSource: PropTypes.string,
  partLabel: PropTypes.string,
  grouping: PropTypes.string.isRequired,
  collectionObjectCategory: PropTypes.string,
  collectionPartLabel: PropTypes.string,
});

export default filtersPropType;
