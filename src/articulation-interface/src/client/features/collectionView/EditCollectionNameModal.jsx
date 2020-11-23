import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import collectionPropType from './collectionPropType';
import { beginEditCollectionName, updateCollectionName } from './collectionsSlice';
import RenameModal from '../../components/RenameModal';

const EditCollectionNameModal = ({
  selectedCollectionID, hide, collections, rename
}) => {
  if (!selectedCollectionID) {
    return null;
  }
  const collection = collections.find(c => c.id === selectedCollectionID);
  if (!collection) {
    return null;
  }
  return (
    <RenameModal
      show={!!selectedCollectionID}
      title={`Rename Collection ${collection.name} (ID: ${selectedCollectionID})`}
      placeholder="Collection Name"
      onSubmit={name => rename(selectedCollectionID, name)}
      onHide={hide}
    />
  );
};

EditCollectionNameModal.propTypes = {
  selectedCollectionID: PropTypes.number,
  collections: PropTypes.arrayOf(collectionPropType.isRequired),
  hide: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
};

EditCollectionNameModal.defaultProps = {
  collections: [],
  selectedCollectionID: undefined,
};

const mapStateToProps = state => ({
  collections: state.collectionView.collections.collections,
  selectedCollectionID: state.collectionView.collections.editingNameOfCollectionID,
});

const mapDispatchToProps = dispatch => ({
  hide: () => dispatch(beginEditCollectionName(undefined)),
  rename: (collectionID, newName) => dispatch(updateCollectionName(collectionID, newName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCollectionNameModal);
