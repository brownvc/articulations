import React, { useRef } from 'react';
import {
  Overlay, OverlayTrigger, Popover, Tooltip
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { togglePartSelection, selectionPropType } from '../../features/jointView/detailView/detailSlice';
import PartTile, { partAndObjectInformationPropType } from './PartTile';
import MovingPartTilePopoverContents from './MovingPartTilePopoverContents';
import TileTypeTooltip from './TileTypeTooltip';
import { hoverPart, endHover } from '../../features/hover/hoverSlice';

const MovingPartTile = (props) => {
  const {
    subject, selection, togglePart, selectedCollectionID, hoverIn, hoverOut, tileSize
  } = props;

  const tileRef = useRef(null);

  const selected = selection.selectedPartAndObjectInformation != null
    && selection.selectedPartAndObjectInformation.part.part_id === subject.part.part_id;

  const tile = (
    <PartTile
      ref={{ tileRef }}
      subject={subject}
      selected={selected}
      clickHandler={() => {
        if (selectedCollectionID) {
          togglePart(subject);
        }
      }}
      tileSize={tileSize}
      onMouseEnter={() => hoverIn(subject.part.part_id)}
      onMouseLeave={hoverOut}
    >
      <TileTypeTooltip tileType="a moving part">
        <DescriptionOutlinedIcon />
      </TileTypeTooltip>
    </PartTile>
  );

  if (selectedCollectionID) {
    return (
      <>
        {tile}
        <Overlay target={tileRef} show={selected} placement="right">
          <Popover>
            <MovingPartTilePopoverContents subject={subject} />
          </Popover>
        </Overlay>
      </>
    );
  }

  return (
    <OverlayTrigger placement="right" overlay={<Tooltip>Open a collection to see base parts and add joints.</Tooltip>} transition={false}>
      {tile}
    </OverlayTrigger>
  );
};

MovingPartTile.propTypes = {
  subject: partAndObjectInformationPropType.isRequired,
  selection: selectionPropType.isRequired,
  selectedCollectionID: PropTypes.number,
  togglePart: PropTypes.func.isRequired,
  hoverIn: PropTypes.func.isRequired,
  hoverOut: PropTypes.func.isRequired,
  tileSize: PropTypes.number.isRequired,
};

MovingPartTile.defaultProps = {
  selectedCollectionID: undefined,
};

const mapDispatchToProps = dispatch => ({
  togglePart: selection => dispatch(togglePartSelection(selection)),
  hoverIn: partID => dispatch(hoverPart(partID)),
  hoverOut: () => dispatch(endHover()),
});

const mapStateToProps = state => ({
  selection: state.jointView.detail,
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  tileSize: state.settingsSlice.datasetTileSize,
});

export default connect(mapStateToProps, mapDispatchToProps)(MovingPartTile);
