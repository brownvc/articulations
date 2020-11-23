import React, { forwardRef } from 'react';
import { PropTypes } from 'prop-types';
import { thumbnailForPartAndObjectInformation } from '../../util/thumbnailURLs';
import Tile from './Tile';

const PartTile = forwardRef((props, ref) => {
  const {
    subject, selected, children, clickHandler, showThumbnail, thumbnail, ...otherProps
  } = props;

  return (
    <Tile
      {...otherProps}
      ref={ref}
      label={`P_${subject.part.part_id}`}
      thumbnail={
        showThumbnail ? (thumbnail || thumbnailForPartAndObjectInformation(subject)) : undefined
      }
      selected={selected}
      clickHandler={clickHandler}
    >
      {children}
    </Tile>
  );
});

// This is a part by itself.
export const partPropType = PropTypes.shape({
  part_id: PropTypes.number,
  part_index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  part_label: PropTypes.string,
});

// This is the format the tile expects for parts.
// The extra information is needed to get the thumbnail.
export const partAndObjectInformationPropType = PropTypes.shape({
  full_id: PropTypes.string,
  part: partPropType
});

PartTile.propTypes = {
  children: PropTypes.element.isRequired,
  subject: partAndObjectInformationPropType.isRequired,
  selected: PropTypes.bool,
  clickHandler: PropTypes.func,
  showThumbnail: PropTypes.bool,
  thumbnail: PropTypes.string,
};

PartTile.defaultProps = {
  selected: false,
  clickHandler: () => { },
  showThumbnail: true,
  thumbnail: undefined,
};

export default PartTile;
