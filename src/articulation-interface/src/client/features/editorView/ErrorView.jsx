import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { setRuleError } from './editorSlice';
import '../../components/util.scss';

const ErrorView = ({ ruleErrors, selectedRuleID, hide }) => {
  if (!selectedRuleID || !ruleErrors[selectedRuleID]) {
    return null;
  }
  return (
    <div className="d-flex flex-column border-bottom">
      <div className="bg-danger text-light d-flex flex-row justify-content-between align-items-center">
        <div className="p-1" style={{ textSize: '0.8rem' }}>Runtime Errors</div>
        <CloseIcon
          className="cursor-pointer mx-1"
          onClick={() => hide({
            ruleID: selectedRuleID,
            error: undefined,
          })}
        />
      </div>

      <div className="p-1">{ruleErrors[selectedRuleID]}</div>
    </div>
  );
};

ErrorView.propTypes = {
  ruleErrors: PropTypes.objectOf(PropTypes.string.isRequired),
  selectedRuleID: PropTypes.number,
  hide: PropTypes.func.isRequired,
};

ErrorView.defaultProps = {
  ruleErrors: {},
  selectedRuleID: undefined,
};

const mapStateToProps = state => ({
  ruleErrors: state.editorView.ruleErrors,
  selectedRuleID: state.editorView.selectedRuleID,
});

const mapDispatchToProps = {
  hide: setRuleError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorView);
