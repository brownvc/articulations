import React from 'react';
import PropTypes from 'prop-types';

// A Bootstrap select that calls the supplied function on update and supports placeholders.
const OptionsFromStringArray = (props) => {
  const { options } = props;
  const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

  // Creates an option for each entry in options.
  const domOptions = [];
  sortedOptions.forEach((option) => {
    domOptions.push(<option key={option}>{option}</option>);
  });

  return (
    <>
      {domOptions}
    </>
  );
};

OptionsFromStringArray.propTypes = {
  // An array of strings that are turned into options.
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OptionsFromStringArray;
