import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import ConnectedSelect from '../../components/ConnectedSelect';
import jointPropType from './jointPropType';
import OptionsFromStringArray from '../../components/OptionsFromStringArray';
import { objectPropType } from '../../components/tile/ObjectTile';
import { setCollectionObjectCategory, setCollectionPartLabel } from '../jointView/filterBar/filtersSlice';

const CollectionFilterBar = ({
  joints, objects, objectCategory, partLabel, setObjectCategory, setPartLabel
}) => {
  // Finds all object full IDs and part IDs in joints.
  const objectFullIDs = new Set();
  const partIDs = new Set();
  (joints || []).forEach((joint) => {
    objectFullIDs.add(joint.full_id);
    partIDs.add(joint.moving_part_id);
    partIDs.add(joint.base_part_id);
  });

  // Finds all valid data sources, object categories and part labels.
  const objectCategories = new Set();
  const partLabels = new Set();
  (objects || []).forEach((o) => {
    // Skips objects not in joints.
    if (!objectFullIDs.has(o.full_id)) {
      return;
    }

    // Adds the object categories.
    (o.category || '').split(',').forEach((c) => {
      objectCategories.add(c);
    });

    // Adds the part labels.
    o.parts.forEach((p) => {
      // Skips parts not in joints.
      if (!partIDs.has(p.part_id)) {
        return;
      }

      (p.part_label || '').split(',').filter(l => l).forEach((l) => {
        partLabels.add(l);
      });
    });
  });

  // Adds the selections in case they're no longer there.
  if (objectCategory) {
    objectCategories.add(objectCategory);
  }
  if (partLabel) {
    partLabels.add(partLabel);
  }

  return (
    <div className="p-1 d-flex flex-row">
      <ConnectedSelect
        className="m-1"
        placeholderText="Object Category"
        value={objectCategory}
        setFunction={setObjectCategory}
        disabled={!objectCategories}
        size="sm"
      >
        <OptionsFromStringArray options={[...objectCategories]} />
      </ConnectedSelect>
      <ConnectedSelect
        className="m-1"
        placeholderText="Part Label"
        value={partLabel}
        setFunction={setPartLabel}
        disabled={!partLabels}
        size="sm"
      >
        <OptionsFromStringArray options={[...partLabels]} />
      </ConnectedSelect>

      <Button
        variant="outline-secondary"
        size="sm"
        className="m-1"
        onClick={() => {
          setObjectCategory(null);
          setPartLabel(null);
        }}
      >
        Reset&nbsp;Filters
      </Button>
    </div>
  );
};

CollectionFilterBar.propTypes = {
  objects: PropTypes.arrayOf(objectPropType.isRequired),
  joints: PropTypes.arrayOf(jointPropType.isRequired),
  objectCategory: PropTypes.string,
  partLabel: PropTypes.string,
  setObjectCategory: PropTypes.func.isRequired,
  setPartLabel: PropTypes.func.isRequired,
};

CollectionFilterBar.defaultProps = {
  objects: [],
  joints: [],
  objectCategory: undefined,
  partLabel: undefined,
};

const mapStateToProps = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    joints: collections.find(c => c.id === selectedCollectionID).joints,
    objects: state.jointView.joints.unconfirmedJoints,
    objectCategory: state.jointView.filters.collectionObjectCategory,
    partLabel: state.jointView.filters.collectionPartLabel,
  };
};

const mapDispatchToProps = {
  setObjectCategory: setCollectionObjectCategory,
  setPartLabel: setCollectionPartLabel,
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionFilterBar);
