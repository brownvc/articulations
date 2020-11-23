import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import { thumbnailForPartAndObjectInformation } from '../../util/thumbnailURLs';
import { toggleDetailSelection, selectionPropType } from '../../features/jointView/detailView/detailSlice';
import Tile from './Tile';
import { partAndObjectInformationPropType } from './PartTile';
import TileTypeTooltip from './TileTypeTooltip';

const PartLabelTile = (props) => {
  const {
    partLabel, subject, selection, toggleDetail, ...otherProps
  } = props;

  const type = 'Part Label';
  const identifier = partLabel;
  const selected = (type === selection.selectionType && identifier === selection.selection);

  // Part label tiles can be selected in the joint view.
  const clickHandler = () => {
    toggleDetail(identifier, type);
  };

  return (
    <Tile
      label={partLabel || '(no part label)'}
      thumbnail={thumbnailForPartAndObjectInformation(subject)}
      selected={selected}
      clickHandler={clickHandler}
      {...otherProps}
    >
      <TileTypeTooltip tileType="a part label" aggregate>
        <LabelOutlinedIcon />
      </TileTypeTooltip>
    </Tile>
  );
};

PartLabelTile.propTypes = {
  partLabel: PropTypes.string,
  subject: partAndObjectInformationPropType.isRequired,
  selection: selectionPropType.isRequired,
  toggleDetail: PropTypes.func.isRequired,
};

PartLabelTile.defaultProps = {
  partLabel: null,
};

const mapDispatchToProps = dispatch => ({
  toggleDetail: (selection, selectionType) => dispatch(toggleDetailSelection({
    selection,
    selectionType,
  })),
});

const mapStateToProps = state => ({
  selection: state.jointView.detail,
});

export default connect(mapStateToProps, mapDispatchToProps)(PartLabelTile);
