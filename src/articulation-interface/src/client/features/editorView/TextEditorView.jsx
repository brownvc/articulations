import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import rulePropType, { isDefaultRule } from './rulePropType';
import { updateRuleText, setRuleUnsaved, saveRuleText } from './editorSlice';
import ErrorView from './ErrorView';
import VisualizationButton from './VisualizationButton';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/hint/show-hint.css';
import './TextEditorView.scss';
import '../../components/util.scss';

//require('codemirror/mode/python/python');
require('./pythonCodeHelper.js');
require('codemirror/addon/hint/show-hint.js');

class TextEditorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorContents: undefined,
    };
    this.handleSaveBound = this.handleSave.bind(this);
    this.codeMirrorRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleSaveBound);
  }

  componentDidUpdate(prevProps) {
    // The selectedRuleID changes whenever a new rule is selected.
    // Any time a new rule is selected, the old rule's text is saved to Redux.
    const { selectedRuleID, rules } = this.props;
    if (prevProps.selectedRuleID !== selectedRuleID) {
      // The ID of the previous rule (whose text needs to be saved) is in prevProps.
      this.saveEditorContents(prevProps.selectedRuleID);

      // If selectedRuleID is undefined, the TextEditorView is about to unmount.
      // This means that the editor's state doesn't need to be changed.
      if (selectedRuleID) {
        const selectedRule = rules.find(r => r.id === selectedRuleID);

        // Using setState is fine because it's only called when the selected rule changes.
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          editorContents: selectedRule.text,
        });
      }
    }
  }

  componentWillUnmount() {
    const { selectedRuleID } = this.props;
    this.saveEditorContents(selectedRuleID);
    document.removeEventListener('keydown', this.handleSaveBound);
  }

  handleSave = (e) => {
    const { savingRule, selectedRuleID, uploadText } = this.props;
    if ((e.ctrlKey || e.metaKey) && String.fromCharCode(e.which).toLowerCase() === 's' && !savingRule) {
      e.preventDefault();
      uploadText(selectedRuleID, this.codeMirrorRef.current.editor.getValue());
    }
  }

  saveEditorContents(forRuleID) {
    const { updateText } = this.props;
    const { editorContents } = this.state;
    updateText(forRuleID, editorContents);
  }

  render() {
    const {
      selectedRuleID, rules, unsavedStatuses, setUnsaved, uploadText, inVisualizationMode,
      savingRule
    } = this.props;
    const { editorContents } = this.state;

    // Shows a message if in visualization mode.
    if (!selectedRuleID) {
      return (
        <div className="w-100 h-100 d-flex flex-row justify-content-center align-items-center">
          Select a rule to edit its text.
        </div>
      );
    }

    const selectedRule = rules.find(r => r.id === selectedRuleID);
    const uneditable = isDefaultRule(selectedRule) || savingRule || inVisualizationMode;
    let helperText;
    if (isDefaultRule(selectedRule)) {
      helperText = 'Default rules are not editable.';
    } else if (inVisualizationMode) {
      helperText = 'Rules are not editable in visualization mode.';
    }

    return (
      <div className="d-flex flex-column w-100 h-100 overflow-hidden">
        <div className="d-flex flex-row p-1 justify-content-between border-bottom align-items-center">
          <div className="d-flex flex-column p-1">
            <h5 className="p-0 m-0">{`${selectedRule.type} Rule ${selectedRule.name}`}</h5>
            {helperText ? <div className="text-secondary">{helperText}</div> : null}
          </div>
          <div>
            <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1kXwj6YqxHTOOu7Z8TBAdUkGnroj7LyLFnPvdaPGDuDM/edit">
              <HelpOutlineIcon className="m-1 cursor-pointer" />
            </a>
            {
              uneditable ? null
                : (
                  <Button
                    className="m-1"
                    size="sm"
                    onClick={() => uploadText(selectedRuleID, editorContents)}
                    disabled={savingRule}
                  >
                    {savingRule ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="mr-2"
                      />
                    ) : null}
                    Save
                  </Button>
                )
            }
            <VisualizationButton />
          </div>
        </div>
        <ErrorView />
        <div className="d-flex flex-grow-1 overflow-hidden">
          <div className="w-100 h-100 overflow-hidden">
            <CodeMirror
              ref={this.codeMirrorRef}
              value={editorContents}
              options={{
                mode: 'python',
                lineNumbers: true,
                readOnly: uneditable,
                extraKeys: {
                  Tab(cm) {
                    cm.replaceSelection('    ', 'end');
                  },
                  "Ctrl-Space": "autocomplete"
                },
                indentUnit: 4,
              }}
              onBeforeChange={(editor, data, value) => {
                this.setState({
                  editorContents: value,
                });
                if (!unsavedStatuses[selectedRuleID]) {
                  setUnsaved(selectedRuleID);
                }
              }}
              className="w-100 h-100"
            />
          </div>
        </div>
      </div>
    );
  }
}

TextEditorView.propTypes = {
  rules: PropTypes.arrayOf(rulePropType),
  selectedRuleID: PropTypes.number,
  updateText: PropTypes.func.isRequired,
  setUnsaved: PropTypes.func.isRequired,
  unsavedStatuses: PropTypes.objectOf(PropTypes.bool),
  uploadText: PropTypes.func.isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  savingRule: PropTypes.bool.isRequired,
};

TextEditorView.defaultProps = {
  rules: [],
  selectedRuleID: undefined,
  unsavedStatuses: {},
};

const mapStateToProps = state => ({
  rules: state.editorView.rules,
  selectedRuleID: state.editorView.selectedRuleID,
  unsavedStatuses: state.editorView.ruleUnsavedStatuses,
  inVisualizationMode: state.editorView.inVisualizationMode,
  savingRule: state.editorView.savingRule,
});

const mapDispatchToProps = dispatch => ({
  updateText: (ruleID, text) => dispatch(updateRuleText({
    ruleID,
    text,
  })),
  setUnsaved: ruleID => dispatch(setRuleUnsaved(ruleID)),
  uploadText: (ruleID, text) => dispatch(saveRuleText(ruleID, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorView);
