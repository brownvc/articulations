import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FilterBar from '../features/jointView/filterBar/FilterBar';
import JointView from '../features/jointView/JointView';
import CollectionView from '../features/collectionView/CollectionView';
import NewCollectionModal from '../features/collectionView/NewCollectionModal';
import SettingsModal from '../features/settings/SettingsModal';
import DetailView from '../features/jointView/detailView/DetailView';
import EditorView from '../features/editorView/EditorView';
import SplitPane from '../components/SplitPane';
import LeftPanelTabs from '../features/collectionView/LeftPanelTabs';
import NotificationModal from '../features/notification/NotificationModal';
import EditCollectionNameModal from '../features/collectionView/EditCollectionNameModal';
import '../components/util.scss';
import DeleteRuleModal from '../features/editorView/DeleteRuleModal';
import EditRuleNameModal from '../features/editorView/EditRuleNameModal';
import EndSessionModal from '../features/session/EndSessionModal';
import CollectionDeletionWarning from '../features/collectionView/CollectionDeletionWarning';
import AddRuleModal from '../features/editorView/addRule/AddRuleModal';
import LibraryRuleDeletionWarning from '../features/editorView/LibraryRuleDeletionWarning';
import RuleDuplicationModal from '../features/editorView/RuleDuplicationModal';

const App = ({ taskName }) => {
  const {
    showingCollections, showingDetail, showingEditor, libraryRuleBeingDeletedID
  } = useSelector(state => ({
    showingCollections: state.collectionView.visibility.visible,
    showingDetail: state.jointView.detail.selection !== null,
    showingEditor: state.editorView.collectionID !== undefined,
    libraryRuleBeingDeletedID: state.editorView.libraryRuleBeingDeletedID,
  }));

  const getLeftSide = () => {
    let content = <JointView taskName={taskName} />;
    if (showingEditor) {
      content = <EditorView />;
    } else if (showingDetail) {
      content = (
        <SplitPane direction="vertical">
          <DetailView />
          <JointView />
        </SplitPane>
      );
    }
    return (
      <div className="d-flex flex-column w-100 h-100">
        <LeftPanelTabs />
        <div className="w-100 d-flex flex-grow-1 overflow-hidden">
          {content}
        </div>
      </div>
    );
  };

  return (
    <>
      <RuleDuplicationModal />
      <CollectionDeletionWarning />
      <EndSessionModal />
      <EditRuleNameModal />
      <DeleteRuleModal />
      <EditCollectionNameModal />
      <NotificationModal />
      <SettingsModal />
      <NewCollectionModal />
      {libraryRuleBeingDeletedID ? <LibraryRuleDeletionWarning /> : <AddRuleModal />}
      <div className="d-flex flex-column h-100">
        <FilterBar />
        <div className="d-flex flex-row w-100 flex-grow-1 overflow-hidden">
          {showingCollections ? (
            <SplitPane minimum={500}>
              {getLeftSide()}
              <CollectionView />
            </SplitPane>
          ) : getLeftSide()}
        </div>
      </div>
    </>
  );
};

App.propTypes = {
  taskName: PropTypes.string,
};

App.defaultProps = {
  taskName: undefined,
};

export default App;
