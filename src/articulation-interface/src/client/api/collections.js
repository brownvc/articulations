import PropTypes from 'prop-types';
import Constants from '../util/Constants';
import collectionPropType from '../features/collectionView/collectionPropType';
import postWithUsername from './postWithUsername';
import { capitalize } from '../util/stringTools';

// Calls the server's API to add a part to a collection.
// If useAcceptInstead is specified, the URL to accept a suggestion is used instead.
// Returns the server's response.
const addJointToCollection = (collectionID, basePartID, movingPartID, useAcceptInstead) => postWithUsername(useAcceptInstead ? `${Constants.baseURL}/articulation-program/collection/joint/accept` : `${Constants.baseURL}/articulation-program/collection/parts`, {
  collections: [{
    collection_id: collectionID,
    moving_part_id: movingPartID,
    base_part_id: basePartID,
  }]
});

// Calls the server's API to delete a part from a collection.
// Returns the server's response.
const removeJointFromCollection = (collectionID, basePartID, movingPartID) => postWithUsername(`${Constants.baseURL}/articulation-program/collection/parts`, {
  collection_id: collectionID,
  moving_part_id: movingPartID,
  base_part_id: basePartID,
}, 'DELETE');

// Updates the collection's name.
const updateCollectionNameAPI = (collectionID, newName) => postWithUsername(`${Constants.baseURL}/articulation-program/collection`, {
  id: collectionID,
  name: newName,
}, 'PUT');

// Calls the server's API to fetch a collection's parts.
// Returns the joints (reformatted to be an array of jointPropType) or throws an error.
const getCollectionsAPI = () => fetch(`${Constants.baseURL}/articulation-program/collection`)
  .then(response => response.json())
  .then(({ result }) => {
    if (!Array.isArray(result)) {
      throw new TypeError('Did not receive an array when fetching collections.');
    }
    const collections = [];
    result.forEach((collection) => {
      collections.push({
        id: parseInt(collection.id, 10),
        name: collection.name,
        joints: collection.joints.map(joint => ({
          base_part_id: parseInt(joint.base_part_id, 10),
          base_part_index: parseInt(joint.base_part_index, 10),
          full_id: joint.full_id,
          moving_part_id: parseInt(joint.moving_part_id, 10),
          moving_part_index: parseInt(joint.moving_part_index, 10),
          articulation: {
            filename: joint.filename,
            minRange: parseFloat(joint.min_range, 10) || undefined,
            maxRange: parseFloat(joint.max_range, 10) || undefined,
            motionType: capitalize(joint.motion_type),
            axis: Array.isArray(joint.axis) ? joint.axis.map(x => parseFloat(x, 10)) : undefined,
            origin: Array.isArray(joint.origin) ? joint.origin.map(
              x => parseFloat(x, 10)
            ) : undefined,
            axisRuleID: parseInt(joint.axis_rule_id, 10) || undefined,
            rangeRuleID: parseInt(joint.range_rule_id, 10) || undefined,
            currentPose: parseFloat(joint.current_pose) || 0,
            ref: (joint.ref || []).map(x => parseFloat(x)) || undefined,
          }
        })),
      });
    });

    // Validates the joints.
    PropTypes.checkPropTypes(PropTypes.arrayOf(collectionPropType).isRequired, collections, 'collections', 'getCollectionsAPI');
    return collections;
  });

export {
  addJointToCollection,
  removeJointFromCollection,
  getCollectionsAPI,
  updateCollectionNameAPI,
};
