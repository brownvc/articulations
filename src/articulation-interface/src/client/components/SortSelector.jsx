/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import RemoveIcon from '@material-ui/icons/Remove';
import './util.scss';

const SortSelector = ({
  category, selectedCategory, selectedMode, onClick, ...otherProps
}) => {
  // Picks the appropriate icon.
  const icon = () => {
    if (category === selectedCategory) {
      if (selectedMode === true) {
        return <KeyboardArrowUpIcon />;
      }
      if (selectedMode === false) {
        return <KeyboardArrowDownIcon />;
      }
    }
    return <RemoveIcon />;
  };

  return (
    <div {...otherProps}>
      <div className="px-1 d-flex flex-row align-items-center user-select-none cursor-pointer" onClick={() => onClick(category)}>
        {category}
        {icon()}
      </div>
    </div>
  );
};

SortSelector.propTypes = {
  category: PropTypes.string.isRequired,
  selectedCategory: PropTypes.string,
  selectedMode: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

SortSelector.defaultProps = {
  selectedCategory: undefined,
  selectedMode: undefined,
};

export default SortSelector;
