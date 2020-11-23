import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { thumbnailForObject } from '../../util/thumbnailURLs';
import { toggleDetailSelection, selectionPropType } from '../../features/jointView/detailView/detailSlice';
import Tile from './Tile';
import { partPropType } from './PartTile';
import TileTypeTooltip from './TileTypeTooltip';
import { hoverObject, endHover } from '../../features/hover/hoverSlice';

const ObjectTile = (props) => {
  const {
    subject, selection, toggleDetail, hoverIn, hoverOut, ...otherProps
  } = props;

  const type = 'Object';
  const identifier = subject.objectID;
  const selected = (type === selection.selectionType && identifier === selection.selection);

  // Object tiles can be selected in the joint view.
  const clickHandler = () => {
    hoverOut();
    toggleDetail(identifier, type);
  };

  return (
    <Tile
      label={`${subject.full_id}`}
      thumbnail={thumbnailForObject(subject)}
      selected={selected}
      clickHandler={clickHandler}
      onMouseEnter={() => hoverIn(subject.full_id)}
      onMouseLeave={hoverOut}
      {...otherProps}
    >
      <TileTypeTooltip tileType="an object" aggregate>
        <DashboardIcon />
      </TileTypeTooltip>
    </Tile>
  );
};

// This is the format the tile expects for objects.
export const objectPropType = PropTypes.shape({
  source: PropTypes.string,
  full_id: PropTypes.string,
  category: PropTypes.string,
  objectID: PropTypes.number,
  parts: PropTypes.arrayOf(partPropType),
});

ObjectTile.propTypes = {
  subject: objectPropType.isRequired,
  selection: selectionPropType.isRequired,
  toggleDetail: PropTypes.func.isRequired,
  hoverIn: PropTypes.func.isRequired,
  hoverOut: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  toggleDetail: (selection, selectionType) => dispatch(toggleDetailSelection({
    selection,
    selectionType,
  })),
  hoverIn: objectFullID => dispatch(hoverObject(objectFullID)),
  hoverOut: () => dispatch(endHover()),
});

const mapStateToProps = state => ({
  selection: state.jointView.detail,
});

export default connect(mapStateToProps, mapDispatchToProps)(ObjectTile);
