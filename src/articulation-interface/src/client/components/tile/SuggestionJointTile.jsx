import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import SettingsIcon from '@material-ui/icons/Settings';
import TileTypeTooltip from './TileTypeTooltip';
import JointTile from './JointTile';
import jointPropType from '../../features/collectionView/jointPropType';
import { removeSuggestion, addJoint } from '../../features/collectionView/collectionsSlice';
import collectionPropType from '../../features/collectionView/collectionPropType';
import { rejectSuggestion } from '../../api/suggestions';
import '../util.scss';

const CollectionDetailJointTile = (props) => {
  const {
    selectedCollection, joint, reject, accept
  } = props;

  // If the selected collection contains a joint with moving part X and base part Y,
  // and this joint has moving part Y and base part X, this joint should be hidden.
  const forbidden = selectedCollection.joints.find(
    collectionJoint => collectionJoint.base_part_id === joint.moving_part_id
      && collectionJoint.moving_part_id === joint.base_part_id
  );
  if (forbidden) {
    return null;
  }

  return (
    <JointTile joint={joint}>
      <div className="w-100 d-flex flex-row justify-content-between">
        <TileTypeTooltip tileType="a joint">
          <SettingsIcon />
        </TileTypeTooltip>
        <div className="d-flex flex-row">
          <CheckIcon className="cursor-pointer" onClick={() => accept(selectedCollection, joint)} />
          <ClearIcon className="cursor-pointer" onClick={() => reject(selectedCollection, joint)} />
        </div>
      </div>
    </JointTile>
  );
};

CollectionDetailJointTile.propTypes = {
  joint: jointPropType.isRequired,
  selectedCollection: collectionPropType.isRequired,
  reject: PropTypes.func.isRequired,
  accept: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    selectedCollection: collections.find(c => c.id === selectedCollectionID),
  };
};

const mapDispatchToProps = dispatch => ({
  reject: (collection, joint) => {
    rejectSuggestion(collection.id, joint.base_part_id, joint.moving_part_id);
    dispatch(removeSuggestion(joint));
  },
  accept: (selectedCollection, joint) => {
    dispatch(removeSuggestion(joint));

    // Creates fake part objects using the joint's information.
    const fakeBasePartAndObjectInformation = {
      full_id: joint.full_id,
      part: {
        part_id: joint.base_part_id,
        part_index: joint.base_part_index,
      }
    };
    const fakeMovingPartAndObjectInformation = {
      full_id: joint.full_id,
      part: {
        part_id: joint.moving_part_id,
        part_index: joint.moving_part_index,
      }
    };

    // Adds the joint to the collection.
    // Ideally, the joint would only be removed from suggestions once added to the collection.
    dispatch(addJoint(
      selectedCollection.id, fakeBasePartAndObjectInformation, fakeMovingPartAndObjectInformation,
      true
    ));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetailJointTile);
