import React from 'react';
import PropTypes from 'prop-types';
import rulePropType from './rulePropType';
import EditorRule from './EditorRule';
import '../../components/util.scss';

const RuleList = (props) => {
  const { rules } = props;

  const content = () => {
    if (Array.isArray(rules) && rules.length > 0) {
      const ruleComponents = rules.map(
        (rule, index) => <EditorRule key={rule.id} odd={index % 2 === 0} rule={rule} />
      );
      return (
        <div className="w-100 h-100 overflow-scroll">
          {ruleComponents}
        </div>
      );
    }
    return (
      <div className="w-100 h-100 d-flex flex-row justify-content-center align-items-center">
        <div>No rules to show.</div>
      </div>
    );
  };

  return content();
};

RuleList.propTypes = {
  rules: PropTypes.arrayOf(rulePropType),
};

RuleList.defaultProps = {
  rules: [],
};

export default RuleList;
