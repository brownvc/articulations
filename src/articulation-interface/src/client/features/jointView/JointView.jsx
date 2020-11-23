import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import PartLabelTile from '../../components/tile/PartLabelTile';
import ObjectTile, { objectPropType } from '../../components/tile/ObjectTile';
import ObjectCategoryTile from '../../components/tile/ObjectCategoryTile';
import { fetchJoints } from './jointsSlice';
import filterJoints from '../../util/filterJoints';
import TileView from '../../components/TileView';
import filtersPropType from './filterBar/filtersPropType';
import collectionPropType from '../collectionView/collectionPropType';
import '../../components/util.scss';

const JointView = (props) => {
  // Sets up joint fetching.
  const {
    unconfirmedJoints, filters, mappedFetchJoints, showHeader, tileSize, taskName, collections
  } = props;
  if (!unconfirmedJoints) {
    mappedFetchJoints(taskName);
  }

  // Creates the tiles.
  const tiles = [];
  if (unconfirmedJoints) {
    const filteredJoints = filterJoints(unconfirmedJoints, filters, collections);

    // Creates different kinds of tiles based on the filters.
    if (filters.grouping === 'Object') {
      filteredJoints.forEach((object) => {
        const { objectID } = object;
        tiles.push(<ObjectTile key={objectID} subject={object} tileSize={tileSize} />);
      });
    } else if (filters.grouping === 'Object Category') {
      // Finds all object categories.
      const objectCategories = new Map();
      filteredJoints.forEach((object) => {
        // The categories are sometimes comma-separated.
        object.category.split(',').forEach((category) => {
          objectCategories.set(category, object);
        });
      });

      // Creates a tile for each object category.
      objectCategories.forEach((object, objectCategory) => {
        const category = objectCategory || '(no part label)';

        // Note: eslint is confused by the use of forEach on a map (it thinks it's an array).
        tiles.push(<ObjectCategoryTile
          // eslint-disable-next-line react/no-array-index-key
          key={category}
          category={category}
          subject={object}
          tileSize={tileSize}
        />);
      });
    } else if (filters.grouping === 'Part Label') {
      // Finds all the part labels.
      const partLabels = new Map();
      filteredJoints.forEach((object) => {
        object.parts.forEach((part) => {
          const partLabel = part.part_label;
          partLabels.set(partLabel, {
            full_id: object.full_id,
            part,
          });
        });
      });

      // Creates a tile for each part label.
      partLabels.forEach((partAndObjectInformation, partLabel) => {
        // Note: eslint is confused by the use of forEach on a map (it thinks it's an array).
        tiles.push(<PartLabelTile
          // eslint-disable-next-line react/no-array-index-key
          key={partLabel}
          partLabel={partLabel}
          subject={partAndObjectInformation}
          tileSize={tileSize}
        />);
      });
    }
  }

  const header = showHeader ? 'Dataset' : undefined;

  // The TileView distinguishes between undefined (loading) and empty list.
  return (
    <TileView header={header}>
      {!unconfirmedJoints ? undefined : tiles}
    </TileView>
  );
};

JointView.propTypes = {
  unconfirmedJoints: PropTypes.arrayOf(objectPropType),
  filters: filtersPropType.isRequired,
  mappedFetchJoints: PropTypes.func.isRequired,
  showHeader: PropTypes.bool.isRequired,
  tileSize: PropTypes.number.isRequired,
  taskName: PropTypes.string,
  collections: PropTypes.arrayOf(collectionPropType),
};

JointView.defaultProps = {
  unconfirmedJoints: null,
  taskName: undefined,
  collections: [],
};

const mapStateToProps = state => ({
  unconfirmedJoints: state.jointView.joints.unconfirmedJoints,
  filters: state.jointView.filters,
  showHeader: state.collectionView.visibility.visible || state.jointView.detail.selection !== null,
  tileSize: state.settingsSlice.datasetTileSize,
  collections: state.collectionView.collections.collections,
});

const mapDispatchToProps = {
  mappedFetchJoints: fetchJoints,
};

export default connect(mapStateToProps, mapDispatchToProps)(JointView);
