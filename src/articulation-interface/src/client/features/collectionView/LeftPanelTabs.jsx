import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { hideSuggestions } from './collectionsSlice';
import { hideEditor, showEditor } from '../editorView/editorSlice';
import { resetShow } from '../editorView/jointAttributes/jointAttributesSlice';

const LeftPanelTabs = (props) => {
  const {
    selectedCollectionID, isEditorOpen, showDatasetTab, showEditorTab
  } = props;

  // Figures out what the ctive key should be.
  let activeKey = 'Dataset';
  if (selectedCollectionID && isEditorOpen) {
    activeKey = 'Editor';
  }

  const onSelect = (eventKey) => {
    if (eventKey === 'Dataset') {
      showDatasetTab();
    } else {
      showEditorTab(selectedCollectionID);
    }
  };

  return (
    <Tabs activeKey={activeKey} id="uncontrolled-tab-example" className="bg-light pl-2 pr-1 pt-2" onSelect={onSelect}>
      <Tab eventKey="Dataset" title="Dataset" disabled={!isEditorOpen} />
      <Tab eventKey="Editor" title="Rule and Motion Editor" disabled={!selectedCollectionID || isEditorOpen} />
    </Tabs>
  );
};

LeftPanelTabs.propTypes = {
  selectedCollectionID: PropTypes.number,
  isEditorOpen: PropTypes.bool.isRequired,
  showDatasetTab: PropTypes.func.isRequired,
  showEditorTab: PropTypes.func.isRequired,
};

LeftPanelTabs.defaultProps = {
  selectedCollectionID: undefined,
};

const mapStateToProps = state => ({
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  isEditorOpen: !!state.editorView.collectionID,
});

const mapDispatchToProps = dispatch => ({
  showDatasetTab: () => {
    dispatch(resetShow());
    dispatch(hideEditor());
  },
  showEditorTab: (collectionID) => {
    dispatch(showEditor(collectionID));
    dispatch(hideSuggestions());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanelTabs);
