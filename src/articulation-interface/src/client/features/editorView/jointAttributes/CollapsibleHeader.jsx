/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import '../../../components/util.scss';

const CollapsibleHeader = ({
  children, header, checked, onChange
}) => {
  const [expanded, setExpanded] = useState(false);

  const icon = () => {
    if (expanded) {
      return <KeyboardArrowDownIcon className="cursor-pointer" />;
    }
    return <KeyboardArrowRightIcon className="cursor-pointer" />;
  };

  return (
    <>
      <div className="d-flex flex-row align-items-center mx-4">
        <Form.Check
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <div
          className="d-flex flex-row cursor-pointer align-items-center user-select-none"
          onClick={() => setExpanded(!expanded)}
        >
          {icon()}
          <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{header}</div>
        </div>
      </div>
      {expanded ? <div className="ml-3 my-2">{children}</div> : null}
    </>
  );
};

CollapsibleHeader.propTypes = {
  children: PropTypes.node,
  header: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

CollapsibleHeader.defaultProps = {
  children: null,
};

export default CollapsibleHeader;
