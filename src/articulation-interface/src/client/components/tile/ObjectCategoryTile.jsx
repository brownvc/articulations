import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import { thumbnailForObject } from '../../util/thumbnailURLs';
import { toggleDetailSelection, selectionPropType } from '../../features/jointView/detailView/detailSlice';
import Tile from './Tile';
import { objectPropType } from './ObjectTile';
import TileTypeTooltip from './TileTypeTooltip';

const ObjectCategoryTile = (props) => {
  const {
    category, subject, selection, toggleDetail, ...otherProps
  } = props;

  const type = 'Object Category';
  const identifier = category;
  const selected = (type === selection.selectionType && identifier === selection.selection);

  // Object category tiles can be selected in the joint view.
  const clickHandler = () => {
    toggleDetail(identifier, type);
  };

  return (
    <Tile
      label={category}
      thumbnail={thumbnailForObject(subject)}
      selected={selected}
      clickHandler={clickHandler}
      {...otherProps}
    >
      <TileTypeTooltip tileType="an object category" aggregate>
        <CategoryOutlinedIcon />
      </TileTypeTooltip>
    </Tile>
  );
};

ObjectCategoryTile.propTypes = {
  category: PropTypes.string.isRequired,
  subject: objectPropType.isRequired,
  selection: selectionPropType.isRequired,
  toggleDetail: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ObjectCategoryTile);
