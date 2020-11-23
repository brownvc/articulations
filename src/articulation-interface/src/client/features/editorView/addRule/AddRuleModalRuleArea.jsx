import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CenteredSpinner from '../../../components/CenteredSpinner';
import LibraryRule from '../LibraryRule';
import rulePropType, { ruleTypeText } from '../rulePropType';
import SortSelector from '../../../components/SortSelector';

const AddRuleModalRuleArea = ({ rules, ruleType, searchName }) => {
  // This is the state used for sorting.
  const [selection, setSelection] = useState({
    category: undefined,
    mode: undefined,
  });

  // Chooses the content of the rule area.
  let content = <CenteredSpinner />;
  if (Array.isArray(rules)) {
    // Shows a message if there are no rules.
    if (rules.length === 0) {
      content = <div>No rules to show.</div>;
    } else {
      // Sorts the rules according to the selection.
      let includedRules = rules.filter(rule => rule.type === ruleType);
      if (searchName) {
        includedRules = includedRules.filter(rule => rule.name.includes(searchName));
      }
      if (selection.category && selection.mode !== undefined) {
        includedRules.sort((a, b) => {
          let textA = '';
          let textB = '';
          if (selection.category === 'Rule Name') {
            textA = a.name;
            textB = b.name;
          } else if (selection.category === 'Rule ID') {
            return selection.mode ? a.id - b.id : b.id - a.id;
          } else if (selection.category === 'Motion Type') {
            textA = a.motionType || textA;
            textB = b.motionType || textB;
          } else if (selection.category === 'Source Type') {
            textA = ruleTypeText(a);
            textB = ruleTypeText(b);
          }
          return selection.mode ? textA.localeCompare(textB, 'en', { sensitivity: 'base' }) : textB.localeCompare(textA, 'en', { sensitivity: 'base' });
        });
      }
      content = includedRules.map((rule, index) => <LibraryRule key={`${rule.id}//${rule.name}`} rule={rule} index={index} />);
    }
  }

  // Updates the sorting when a SortSelector is clicked.
  const clickHandler = (category) => {
    let newMode = true;
    if (category === selection.category) {
      if (selection.mode === false) {
        newMode = undefined;
      } else if (selection.mode === true) {
        newMode = false;
      }
    }
    setSelection({
      category,
      mode: newMode,
    });
  };

  return (
    <div className="d-flex flex-column w-100 h-100 border rounded">
      <div className="w-100 bg-light border-bottom p-1 d-flex flex-row">
        <SortSelector category="Rule Name" className="flex-basis-0 flex-grow-1" onClick={clickHandler} selectedCategory={selection.category} selectedMode={selection.mode} />
        <SortSelector category="Rule ID" className="flex-basis-0 flex-grow-1" onClick={clickHandler} selectedCategory={selection.category} selectedMode={selection.mode} />
        <SortSelector category="Motion Type" className="flex-basis-0 flex-grow-1" onClick={clickHandler} selectedCategory={selection.category} selectedMode={selection.mode} />
        <SortSelector category="Source Type" className="flex-basis-0 flex-grow-1" onClick={clickHandler} selectedCategory={selection.category} selectedMode={selection.mode} />
      </div>
      <div className="d-flex flex-grow-1 overflow-hidden">
        <div className="w-100 h-100 overflow-scroll">
          {content}
        </div>
      </div>
    </div>
  );
};

AddRuleModalRuleArea.propTypes = {
  ruleType: PropTypes.string,
  rules: PropTypes.arrayOf(rulePropType.isRequired),
  searchName: PropTypes.string,
};

AddRuleModalRuleArea.defaultProps = {
  ruleType: undefined,
  rules: undefined,
  searchName: undefined,
};

export default AddRuleModalRuleArea;
