import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

// A Bootstrap select that calls the supplied function on update and supports placeholders.
const ConnectedSelect = (props) => {
  const {
    value, setFunction, className, placeholderText, children, disabled, ...otherProps
  } = props;

  return (
    <Form.Control
      className={className}
      as="select"
      onChange={
        event => setFunction(event.target.selectedIndex || !placeholderText ? event.target.value : undefined)
      }
      value={value || placeholderText}
      disabled={disabled}
      {...otherProps}
    >
      {
        // Shows a default selection with a null value if there's a placeholderText.
        placeholderText == null ? null : <option value={undefined}>{placeholderText}</option>
      }
      {
        // Options go here.
        children
      }
    </Form.Control>
  );
};

ConnectedSelect.propTypes = {
  value: PropTypes.string,

  // This is called whenever the value is changed.
  setFunction: PropTypes.func.isRequired,

  // Classes here are appended to the select.
  className: PropTypes.string,

  // When the placeholder option is selected, null is passed to the setFunction.
  placeholderText: PropTypes.string,

  // Options go here.
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

ConnectedSelect.defaultProps = {
  value: undefined,
  className: '',
  placeholderText: null,
  children: null,
  disabled: false,
};

export default ConnectedSelect;
