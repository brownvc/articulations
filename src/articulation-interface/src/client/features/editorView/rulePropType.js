import PropTypes from 'prop-types';

const rulePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.oneOf(['Axis', 'Range']).isRequired,
  motionType: PropTypes.string, // only for axis rules
  text: PropTypes.string,
  createdBy: PropTypes.string,
  isLibraryRule: PropTypes.bool.isRequired,
});

export const isDefaultRule = rule => rule.createdBy === 'default' && rule.isLibraryRule;

export const ruleTypeText = (rule) => {
  if (isDefaultRule(rule)) {
    return 'default rule';
  }
  if (rule.isLibraryRule) {
    return 'library rule';
  }
  return 'local rule';
};

export default rulePropType;
