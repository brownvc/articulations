import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DeletionWarning from '../notification/DeletionWarning';
import { setDeletingCollectionID, deleteCollection } from './collectionsSlice';
import collectionPropType from './collectionPropType';

const CollectionDeletionWarning = ({ collection, close, confirm }) => (
  <DeletionWarning
    title="Delete Collection"
    message={`Are you sure you want to delete the collection ${(collection || {}).name} (ID: ${(collection || {}).id})?`}
    confirm={() => confirm(collection.id)}
    close={close}
    show={!!collection}
  />
);

CollectionDeletionWarning.propTypes = {
  collection: collectionPropType,
  close: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
};

CollectionDeletionWarning.defaultProps = {
  collection: undefined,
};

const mapState = (state) => {
  const { deletingCollectionID, collections } = state.collectionView.collections;
  return {
    collection: (collections || []).find(c => c.id === deletingCollectionID),
  };
};

const mapDispatch = dispatch => ({
  close: () => dispatch(setDeletingCollectionID(undefined)),
  confirm: collectionID => dispatch(deleteCollection(collectionID)),
});

export default connect(mapState, mapDispatch)(CollectionDeletionWarning);
