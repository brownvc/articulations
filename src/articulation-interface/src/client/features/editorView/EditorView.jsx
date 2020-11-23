import React from 'react';
import SplitPane from '../../components/SplitPane';
import RuleView from './RuleView';
import TextEditorView from './TextEditorView';
import '../../components/util.scss';

const EditorView = () => (
  <div className="w-100 h-100 d-flex flex-column">
    <div className="d-flex flex-grow-1 overflow-hidden">
      <SplitPane direction="vertical">
        <RuleView />
        <TextEditorView />
      </SplitPane>
    </div>
  </div>
);

export default EditorView;
