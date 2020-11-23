/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Spinner
} from 'react-bootstrap';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SimpleTooltip from '../../components/SimpleTooltip';
import {
  hideEditor
} from '../editorView/editorSlice';
import collectionPropType from './collectionPropType';
import { makeJointID } from './jointPropType';
import { deselectCollection, fetchSuggestions } from './collectionsSlice';
import CenteredSpinner from '../../components/CenteredSpinner';
import CollectionDetailJointTile from '../../components/tile/CollectionDetailJointTile';
import { removePopover } from '../jointView/detailView/detailSlice';
import filtersPropType from '../jointView/filterBar/filtersPropType';
import WebGLWrapper from '../webGL/WebGLWrapper';
import TileView from '../../components/TileView';
import SuggestRulesButton from '../editorView/SuggestRulesButton';
import JointAttributesButton from '../editorView/jointAttributes/JointAttributesButton';
import ApplyRulesButton from '../editorView/ApplyRulesButton';
import '../../components/util.scss';
import PlayPauseButton from '../editorView/PlayPauseButton';
import SelectDeselectAllButton from '../editorView/SelectDeselectAllButton';
import EvaluateRuleSuggestionsButton from '../editorView/EvaluateRuleSuggestionsButton';
import CollectionFilterBar from './CollectionFilterBar';
import { objectPropType } from '../../components/tile/ObjectTile';

class CollectionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  buttons() {
    const {
      showingRuleEditor, selectedCollection, fetchingSuggestions, suggestions, filters, exit,
      taskName,
    } = this.props;

    // The exit button is disabled and shows a tooltip if the editor is open.
    const exitIcon = () => {
      if (showingRuleEditor) {
        return (
          <SimpleTooltip text="You must first close the editor to exit this collection.">
            <ExitToAppIcon className="m-2 cursor-pointer color-button-secondary-disabled" />
          </SimpleTooltip>
        );
      }
      return <ExitToAppIcon className="m-2 cursor-pointer" onClick={exit} />;
    };

    if (showingRuleEditor) {
      return (
        <div className="w-100 h-100 p-1 d-flex flex-row justify-content-between align-items-center bg-white">
          <div className="d-flex flex-row flex-wrap">
            <ApplyRulesButton className="m-1" size="sm" variant="secondary" />
            <SuggestRulesButton className="m-1" size="sm" variant="secondary" />
            <PlayPauseButton className="m-1" size="sm" variant="secondary" />
            <SelectDeselectAllButton className="m-1" size="sm" variant="secondary" />
            <JointAttributesButton className="m-1" size="sm" />
            <EvaluateRuleSuggestionsButton className="m-1" size="sm" variant="secondary" />
          </div>
          <div className="d-flex flex-row align-items-center">
            {exitIcon()}
          </div>
        </div>
      );
    }
    return (
      <div className="w-100 h-100 d-flex flex-column bg-white">
        <div className="w-100 h-100 p-1 d-flex flex-row justify-content-between align-items-center border-bottom">
          <div className="d-flex flex-row">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => suggestions(
                selectedCollection.id,
                undefined,
                filters.objectCategory,
                filters.partLabel,
                taskName
              )}
              disabled={fetchingSuggestions || selectedCollection.joints.length === 0}
              className="m-1"
            >
              {fetchingSuggestions ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {' '}
                </>
              ) : null}
              {'Suggest Joints'}
            </Button>
          </div>
          {exitIcon()}
        </div>
        <CollectionFilterBar />
      </div>
    );
  }

  updateRefs(joint, ref) {
    const key = makeJointID(joint);
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state[key]) {
      const newState = {};
      newState[key] = ref;
      this.setState(newState);
    }
  }

  filteredJoints() {
    const {
      selectedCollection, objectCategory, partLabel, objects
    } = this.props;

    // Finds all valid object full IDs and part IDs for the given filters.
    const objectFullIDs = new Set();
    const partIDs = new Set();
    (objects || []).forEach((o) => {
      if (objectCategory && o.category && !o.category.includes(objectCategory)) {
        return;
      }
      objectFullIDs.add(o.full_id);
      o.parts.forEach((p) => {
        if (partLabel && p.part_label && !p.part_label.includes(partLabel)) {
          return;
        }
        partIDs.add(p.part_id);
      });
    });
    return selectedCollection.joints.filter((joint) => {
      if (objectCategory && !objectFullIDs.has(joint.full_id)) {
        return false;
      }
      if (partLabel && !partIDs.has(joint.moving_part_id) && !partIDs.has(joint.base_part_id)) {
        return false;
      }
      return true;
    });
  }

  render() {
    const {
      selectedCollection,
      showingRuleEditor,
      useGifs,
      inVisualizationMode,
    } = this.props;

    // Inserts the list of joints.
    let content = <CenteredSpinner />;

    // Shows the joints or the loading spinner.
    if (Array.isArray(selectedCollection.joints)) {
      const tiles = [];
      this.filteredJoints().forEach(joint => tiles.push(
        <CollectionDetailJointTile
          key={`${joint.moving_part_id}.${joint.base_part_id}`}
          joint={joint}
          ref={{ imageAreaRef: ref => this.updateRefs(joint, ref) }}
        />
      ));
      let header = `Collection: ${selectedCollection.name} (ID: ${selectedCollection.id})`;
      if (inVisualizationMode) {
        header = 'Preview Mode';
      }
      content = (
        <TileView header={header} toolbar={<div className="border-bottom">{this.buttons()}</div>}>
          {tiles}
        </TileView>
      );
    }

    return (
      <div className="d-flex flex-column w-100 h-100">
        <div className="flex-grow-1 overflow-hidden" style={{ position: 'relative' }}>
          {(showingRuleEditor && !useGifs) ? <WebGLWrapper refs={this.state} /> : null}
          <div className="w-100 h-100" style={{ zIndex: 3, position: 'relative' }}>{content}</div>
        </div>
      </div>
    );
  }
}

CollectionDetail.propTypes = {
  selectedCollection: collectionPropType,
  exit: PropTypes.func.isRequired,
  filters: filtersPropType.isRequired,
  suggestions: PropTypes.func.isRequired,
  fetchingSuggestions: PropTypes.bool.isRequired,
  showingRuleEditor: PropTypes.bool.isRequired,
  useGifs: PropTypes.bool.isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  taskName: PropTypes.string,
  objectCategory: PropTypes.string,
  partLabel: PropTypes.string,
  objects: PropTypes.arrayOf(objectPropType.isRequired),
};

CollectionDetail.defaultProps = {
  selectedCollection: undefined,
  taskName: undefined,
  objectCategory: undefined,
  partLabel: undefined,
  objects: [],
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    selectedCollection: collections.find(c => c.id === selectedCollectionID),
    filters: state.jointView.filters,
    fetchingSuggestions: state.collectionView.collections.fetchingSuggestions,
    showingRuleEditor: state.editorView.collectionID !== undefined,
    selectedJoints: state.editorView.selectedJoints,
    rules: state.editorView.rules,
    useGifs: state.settingsSlice.usePrerenderedThumbnails,
    inVisualizationMode: state.editorView.inVisualizationMode,
    taskName: state.jointView.joints.taskName,
    objectCategory: state.jointView.filters.collectionObjectCategory,
    partLabel: state.jointView.filters.collectionPartLabel,
    objects: state.jointView.joints.unconfirmedJoints,
  };
};

const mapDispatchToProps = dispatch => ({
  exit: () => {
    dispatch(deselectCollection());
    dispatch(removePopover());
    dispatch(hideEditor());
  },
  suggestions: (collectionID, source, category, partLabel, taskName) => dispatch(
    fetchSuggestions(collectionID, source, category, partLabel, taskName)
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetail);
