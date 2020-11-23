import React from 'react';
import PropTypes from 'prop-types';
import SimpleTooltip from '../SimpleTooltip';

// This tooltip shows a tile's type when the tile's icon is hovered.
// It exists to maintain consistency and avoid the annoying multiline thing necessitated by the
// span.
const TileTypeTooltip = (props) => {
  const { children, tileType, aggregate } = props;
  return (
    <SimpleTooltip text={(
      <span>
        {`This tile represents ${aggregate ? 'all parts for ' : ''} `}
        <span className="font-weight-bold">{tileType}</span>
        .
      </span>
    )}
    >
      {children}
    </SimpleTooltip>
  );
};

TileTypeTooltip.propTypes = {
  tileType: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  aggregate: PropTypes.bool,
};

TileTypeTooltip.defaultProps = {
  aggregate: false,
};

export default TileTypeTooltip;
