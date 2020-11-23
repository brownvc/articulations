import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import PartTile from './PartTile';
import jointPropType from '../../features/collectionView/jointPropType';
import { thumbnailForJoint } from '../../util/thumbnailURLs';

const JointTile = forwardRef((props, ref) => {
  const {
    joint, children, selected, clickHandler, thumbnail, ...otherProps
  } = props;

  const objectID = joint.full_id.split('.')[1];

  return (
    <PartTile
      subject={{
        full_id: joint.full_id,
        part: {
          part_id: joint.moving_part_id,
          part_index: joint.moving_part_index,
          part_label: undefined,
          render_hash: undefined,
          collection_id: undefined,
        }
      }}
      ref={ref}
      selected={selected}
      clickHandler={clickHandler}
      thumbnail={
        thumbnail || thumbnailForJoint(objectID, joint.moving_part_index, joint.base_part_index)
      }
      showThumbnail
      {...otherProps}
    >
      {children}
    </PartTile>
  );
});

JointTile.propTypes = {
  joint: jointPropType.isRequired,
  children: PropTypes.element,
  selected: PropTypes.bool,
  clickHandler: PropTypes.func,
  thumbnail: PropTypes.string,
};

JointTile.defaultProps = {
  children: undefined,
  selected: false,
  clickHandler: () => { },
  thumbnail: undefined,
};

export default JointTile;
