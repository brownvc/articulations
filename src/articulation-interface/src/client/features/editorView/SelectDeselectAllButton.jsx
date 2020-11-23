import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { selectAllJoints, deselectAllJoints } from './editorSlice';
import SimpleTooltip from '../../components/SimpleTooltip';
import jointPropType from '../collectionView/jointPropType';

const SelectDeselectAllButton = (props) => {
  const {
    selectAll, deselectAll, collectionJoints, variant, inVisualizationMode, ...otherProps
  } = props;
  return (
    <SimpleTooltip text="Selection is disabled in visualization mode." disabled={!inVisualizationMode}>
      <span>
        <ButtonGroup {...otherProps}>
          <Button
            variant={variant}
            onClick={() => selectAll(collectionJoints)}
            disabled={inVisualizationMode}
          >
            Select&nbsp;All
          </Button>
          <Button
            variant={variant}
            onClick={deselectAll}
            disabled={inVisualizationMode}
          >
            Deselect&nbsp;All
          </Button>
        </ButtonGroup>
      </span>
    </SimpleTooltip>
  );
};

SelectDeselectAllButton.propTypes = {
  variant: PropTypes.string,
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  collectionJoints: PropTypes.arrayOf(jointPropType),
  inVisualizationMode: PropTypes.bool.isRequired,
};

SelectDeselectAllButton.defaultProps = {
  collectionJoints: [],
  variant: 'primary',
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    collectionJoints: collections.find(c => c.id === selectedCollectionID).joints,
    inVisualizationMode: state.editorView.inVisualizationMode,
  };
};

const mapDispatchToProps = {
  selectAll: selectAllJoints,
  deselectAll: deselectAllJoints,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectDeselectAllButton);
