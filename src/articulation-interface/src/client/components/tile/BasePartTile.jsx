import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { makeJointID } from '../../features/collectionView/jointPropType';
import collectionPropType from '../../features/collectionView/collectionPropType';
import PartTile, { partAndObjectInformationPropType } from './PartTile';
import { addJoint } from '../../features/collectionView/collectionsSlice';
import { removePopover } from '../../features/jointView/detailView/detailSlice';
import TileTypeTooltip from './TileTypeTooltip';

const BasePartTile = (props) => {
  const {
    subject, add, movingPart, selectedCollectionID, collections
  } = props;
  if (!movingPart) {
    return null;
  }

  // Constructs a joint ID for the joint the base part tile represents.
  const basePartID = subject.part.part_id;
  const movingPartID = movingPart.part.part_id;
  const jointID = makeJointID({
    base_part_id: basePartID,
    moving_part_id: movingPartID,
  });

  // Checks whether the joint ID is already in the collection.
  const jointAlreadyInCollection = collections.some(
    collection => collection.joints.some(joint => makeJointID(joint) === jointID)
  );

  const clickHandler = () => {
    if (selectedCollectionID && !jointAlreadyInCollection) {
      add(selectedCollectionID, subject, movingPart);
    }
  };

  return (
    <PartTile
      subject={subject}
      selected={false}
      clickHandler={clickHandler}
    >
      <div className="h-100 d-flex flex-column justify-content-between">
        <TileTypeTooltip tileType="a base part">
          <DescriptionOutlinedIcon />
        </TileTypeTooltip>
        {
          jointAlreadyInCollection ? <div className="m-1">(in a collection)</div> : null
        }
      </div>
    </PartTile>
  );
};

BasePartTile.propTypes = {
  subject: partAndObjectInformationPropType.isRequired,
  add: PropTypes.func.isRequired,
  selectedCollectionID: PropTypes.number,
  movingPart: partAndObjectInformationPropType,
  collections: PropTypes.arrayOf(collectionPropType),
};

BasePartTile.defaultProps = {
  selectedCollectionID: undefined,
  collections: [],
  movingPart: undefined,
};

const mapStateToProps = state => ({
  movingPart: state.jointView.detail.selectedPartAndObjectInformation,
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  collections: state.collectionView.collections.collections,
});

const mapDispatchToProps = dispatch => ({
  add: (
    collectionID, basePartAndObjectInformation, movingPartAndObjectInformation
  ) => {
    dispatch(
      addJoint(collectionID, basePartAndObjectInformation, movingPartAndObjectInformation, false)
    );
    dispatch(removePopover());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BasePartTile);
