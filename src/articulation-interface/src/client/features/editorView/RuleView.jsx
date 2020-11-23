import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { showAddRuleModal, fetchCollectionRules } from './editorSlice';
import rulePropType from './rulePropType';
import CenteredSpinner from '../../components/CenteredSpinner';
import RuleList from './RuleList';
import '../../components/util.scss';

class RuleView extends React.Component {
  constructor(props) {
    super(props);
    const { getRules, selectedCollectionID } = props;
    getRules(selectedCollectionID);
  }

  render() {
    const { addRule, rules } = this.props;
    let mainArea = null;
    if (!Array.isArray(rules)) {
      mainArea = (
        <div className="d-flex flex-grow-1">
          <CenteredSpinner />
        </div>
      );
    } else {
      // Sorts the rules into axis and range rules.
      const axisRules = [];
      const rangeRules = [];
      rules.forEach((rule) => {
        if (rule.type === 'Axis') {
          axisRules.push(rule);
        } else {
          rangeRules.push(rule);
        }
      });

      mainArea = (
        <div className="d-flex flex-grow-1 w-100 overflow-hidden">
          <div className="d-flex flex-row w-100">
            <div className="d-flex flex-column w-50 h-100 border-right">
              <div className="p-1 d-flex flex-row justify-content-between align-items-center">
                <h5 className="m-1">Axis Rules</h5>
                <AddCircleOutlineIcon className="m-1 cursor-pointer" onClick={() => addRule('Axis')} />
              </div>
              <div className="border-top d-flex flex-column flex-grow-1 w-100 overflow-hidden">
                <RuleList rules={axisRules} />
              </div>
            </div>
            <div className="d-flex flex-column w-50 h-100">
              <div className="p-1 d-flex flex-row justify-content-between align-items-center">
                <h5 className="m-1">Range Rules</h5>
                <AddCircleOutlineIcon className="m-1 cursor-pointer" onClick={() => addRule('Range')} />
              </div>
              <div className="border-top d-flex flex-column flex-grow-1 w-100 overflow-hidden">
                <RuleList rules={rangeRules} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-100 h-100 d-flex flex-column">
        {mainArea}
      </div>
    );
  }
}

RuleView.propTypes = {
  addRule: PropTypes.func.isRequired,
  getRules: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(rulePropType),
  selectedCollectionID: PropTypes.number.isRequired,
};

RuleView.defaultProps = {
  rules: undefined,
};

const mapStateToProps = state => ({
  rules: state.editorView.rules,
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
});

const mapDispatchToProps = dispatch => ({
  addRule: ruleType => dispatch(showAddRuleModal(ruleType)),
  getRules: collectionID => dispatch(fetchCollectionRules(collectionID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RuleView);
