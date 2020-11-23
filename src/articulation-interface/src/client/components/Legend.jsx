import React from 'react';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SimpleToolTip from './SimpleTooltip';

const Legend = ({ className }) => (
  <div className={`border rounded text-dark bg-white d-flex flex-row align-items-center ${className}`}>
    <div className="d-flex flex-row align-items-center">
      <SimpleToolTip text="A joint consists of a base part (purple) and a primary moving part (dark green). Secondary moving parts (light green) move together with the moving part, but are not part of the joint.">
        <HelpOutlineIcon className="mx-2" />
      </SimpleToolTip>
      <div>
        <div className="d-flex flex-row align-items-center">
          <div style={{ backgroundColor: '#00873f', width: '1rem', height: '1rem' }} className="mr-1 rounded" />
          <div className="mr-2">Moving&nbsp;Part</div>
          <div style={{ backgroundColor: '#63d498', width: '1rem', height: '1rem' }} className="mr-1 rounded" />
          <div className="mr-2">Secondary&nbsp;Moving&nbsp;Part</div>
        </div>
        <div className="d-flex flex-row align-items-center">
          <div style={{ backgroundColor: '#555555', width: '1rem', height: '1rem' }} className="mr-1 rounded" />
          <div className="mr-2">Static&nbsp;Part</div>
          <div style={{ backgroundColor: '#6d00b5', width: '1rem', height: '1rem' }} className="mr-1 rounded" />
          <div>Base&nbsp;Part</div>
        </div>
      </div>
    </div>
  </div>
);

Legend.propTypes = {
  className: PropTypes.string,
};

Legend.defaultProps = {
  className: undefined,
};

export default Legend;
