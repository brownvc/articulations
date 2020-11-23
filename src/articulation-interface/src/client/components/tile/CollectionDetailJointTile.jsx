
import React, { forwardRef, useRef } from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import JointTile from './JointTile';
import jointPropType, { makeJointID } from '../../features/collectionView/jointPropType';
import { removeJoint } from '../../features/collectionView/collectionsSlice';
import { toggleJointSelection, addJointToVisualization, removeJointFromVisualization } from '../../features/editorView/editorSlice';
import TileTypeTooltip from './TileTypeTooltip';
import RuleTag from '../RuleTag';
import internalArticulationPropType from '../../features/editorView/internalArticulationPropType';
import rulePropType from '../../features/editorView/rulePropType';
import MotionTypeIcon from '../MotionTypeIcon';

const CollectionDetailJointTile = forwardRef((props, ref) => {
  const {
    joint, selectedCollectionID, remove, showingEditor, selectedJoints, toggleSelection,
    showGifs, tileSize, suggested, hoverTarget, hoverType, inVisualizationMode, state,
    visualizedArticulations, selectedRule, gettingVisualization, addToVisualization,
    visualizedErrors, removeFromVisualization, loadedJoints,
  } = props;

  const clickPosition = useRef(undefined);

  // Checks to see if this tile is selected.
  const jointID = makeJointID(joint);
  const selected = selectedJoints.find(
    selectedJointID => jointID === selectedJointID
  ) !== undefined;

  // If this is defined, it's the suggested articulation for this joint.
  const suggestion = suggested[jointID];

  // Clicking toggles selection for this tile if the editor is open.
  const clickHandler = ({ clientX, clientY }) => {
    let movement = 0;
    if (clickPosition.current) {
      const dx = clientX - clickPosition.current.clientX;
      const dy = clientY - clickPosition.current.clientY;
      movement = dx * dx + dy * dy;
    }
    if (showingEditor && movement < 10 && !gettingVisualization) {
      const wasSelected = selected;
      toggleSelection(joint);
      if (inVisualizationMode) {
        if (wasSelected) {
          removeFromVisualization(jointID);
        } else {
          addToVisualization(state, joint);
        }
      }
    }
  };

  const mouseDownHandler = ({ clientX, clientY }) => {
    clickPosition.current = {
      clientX,
      clientY,
    };
  };

  // Figures out if a gif needs to be shown.
  // If a suggestion exists, it's shown instead of the articulation.
  let gif;
  const { articulation } = joint;
  if (showGifs && showingEditor) {
    if (suggestion) {
      gif = suggestion.filename;
    } else if (articulation && articulation.filename) {
      gif = articulation.filename;
    }
  }

  const tags = () => {
    // Figures out what the tags should show.
    let { axisRuleID, rangeRuleID } = articulation;
    let isAxisSuggestion = false;
    let isRangeSuggestion = false;
    if (suggestion) {
      axisRuleID = suggestion.axisRuleID || axisRuleID;
      isAxisSuggestion = !!suggestion.axisRuleID && !suggestion.rangeRuleID;
      rangeRuleID = suggestion.rangeRuleID || rangeRuleID;
      isRangeSuggestion = !!suggestion.rangeRuleID;
    }

    return (
      <div className="d-flex flex-row">
        {axisRuleID ? <RuleTag ruleID={axisRuleID} ruleType="axis" isSuggestion={isAxisSuggestion} joint={joint} /> : null}
        {rangeRuleID ? <RuleTag ruleID={rangeRuleID} ruleType="range" isSuggestion={isRangeSuggestion} joint={joint} className="ml-1" /> : null}
      </div>
    );
  };

  let content = null;
  if (showingEditor) {
    content = tags();
  } else {
    content = (
      <DeleteIcon onClick={
        () => remove(selectedCollectionID, joint.base_part_id, joint.moving_part_id)}
      />
    );
  }

  // Figures out the visualization tag text.
  let visualizationTagText;
  if (inVisualizationMode && selected && selectedRule) {
    if (visualizedErrors[jointID]) {
      visualizationTagText = 'Errored';
    } else if (visualizedArticulations[jointID]) {
      visualizationTagText = 'Preview';
    } else if (selectedRule.type === 'Range' && !articulation.axisRuleID) {
      visualizationTagText = 'No Axis Rule';
    } else if (articulation.motionType
      && selectedRule.motionType.toUpperCase() !== articulation.motionType.toUpperCase()) {
      visualizationTagText = 'Motion Type Mismatch';
    } else {
      visualizationTagText = 'Waiting...';
    }
  }

  // Figures out the hover text.
  let hoverText;
  if (hoverType === 'object' && hoverTarget === joint.full_id) {
    hoverText = `object: ${hoverTarget}`;
  } else if (hoverType === 'part') {
    if (hoverTarget === joint.base_part_id) {
      hoverText = `base part: ${joint.base_part_id}`;
    } else if (hoverTarget === joint.moving_part_id) {
      hoverText = `moving part: ${joint.moving_part_id}`;
    }
  }
  const motionType = articulation && articulation.motionType ? articulation.motionType : null;
  return (
    <JointTile
      joint={joint}
      ref={ref}
      showThumbnail={showGifs || !showingEditor}
      selected={selected}
      clickHandler={clickHandler}
      onMouseDown={mouseDownHandler}
      tileSize={tileSize}
      thumbnail={gif}
    >
      <div className="w-100 h-100 d-flex flex-column justify-content-between">
        <div className="d-flex flex-row justify-content-between">
          <div>
            {showingEditor ? null : (
              <TileTypeTooltip tileType="a joint">
                <SettingsIcon />
              </TileTypeTooltip>
            )}
          </div>
          {content}
        </div>
        {loadedJoints[jointID] || !showingEditor || showGifs ? null : (
          <div className="d-flex flex-row justify-content-center">
            <Spinner animation="border" />
          </div>
        )}
        <div className="d-flex flex-row justify-content-between">
          <div>
            {hoverType ? (
              <div>
                <Badge variant="dark">{hoverText}</Badge>
              </div>
            ) : null}
            {visualizationTagText ? (
              <div>
                <Badge variant="success">{visualizationTagText}</Badge>
              </div>
            ) : null}
          </div>
          {motionType && showingEditor ? <MotionTypeIcon motionType={motionType} /> : null}
        </div>

      </div>
    </JointTile>
  );
});

CollectionDetailJointTile.propTypes = {
  joint: jointPropType.isRequired,
  selectedCollectionID: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  showingEditor: PropTypes.bool.isRequired,
  selectedJoints: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  toggleSelection: PropTypes.func.isRequired,
  showGifs: PropTypes.bool.isRequired,
  tileSize: PropTypes.number.isRequired,
  suggested: PropTypes.objectOf(internalArticulationPropType.isRequired).isRequired,
  visualizedArticulations: PropTypes.objectOf(internalArticulationPropType.isRequired).isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  gettingVisualization: PropTypes.bool.isRequired,
  hoverTarget: PropTypes.string,
  hoverType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRule: rulePropType,
  addToVisualization: PropTypes.func.isRequired,
  visualizedErrors: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  removeFromVisualization: PropTypes.func.isRequired,
  loadedJoints: PropTypes.objectOf(PropTypes.bool).isRequired,

  // I really don't want to type out a million PropTypes for the stuff enterVisualizationMode needs.
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.any,
};

CollectionDetailJointTile.defaultProps = {
  hoverTarget: undefined,
  hoverType: undefined,
  selectedRule: undefined,
  state: undefined,
};

const mapStateToProps = state => ({
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  selectedJoints: state.editorView.selectedJoints,
  showingEditor: state.editorView.collectionID !== undefined,
  showGifs: state.settingsSlice.usePrerenderedThumbnails,
  tileSize: state.settingsSlice.collectionTileSize,
  suggested: state.editorView.suggestedArticulations,
  hoverTarget: state.hoverSlice.hoverTarget,
  hoverType: state.hoverSlice.hoverType,
  visualizedArticulations: state.editorView.visualizedArticulations,
  inVisualizationMode: state.editorView.inVisualizationMode,
  gettingVisualization: state.editorView.gettingVisualization,
  selectedRule: (state.editorView.rules || []).find(r => r.id === state.editorView.selectedRuleID),
  visualizedErrors: state.editorView.visualizedErrors,
  loadedJoints: state.editorView.loadedJoints,
  state,
});

const mapDispatchToProps = {
  remove: removeJoint,
  toggleSelection: toggleJointSelection,
  addToVisualization: addJointToVisualization,
  removeFromVisualization: removeJointFromVisualization,
};

export default connect(
  mapStateToProps, mapDispatchToProps, null, { forwardRef: true }
)(CollectionDetailJointTile);
