import Constants from '../util/Constants';
import postWithUsername from './postWithUsername';

const getJointAttributesAPI = joints => postWithUsername(`${Constants.baseURL}/articulation-program/collection/joint/attributes`, joints.map(joint => ({
  full_id: joint.full_id,
  moving_part_id: joint.moving_part_id,
  base_part_id: joint.base_part_id,
  moving_part_index: joint.moving_part_index,
  base_part_index: joint.base_part_index,
})));

export {
  // eslint-disable-next-line import/prefer-default-export
  getJointAttributesAPI,
};
