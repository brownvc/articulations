/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import collectionPropType from './collectionPropType';
import { setDeletingCollectionID, selectCollection, beginEditCollectionName } from './collectionsSlice';
import '../../components/util.scss';

const Collection = (props) => {
  const {
    collection, doDelete, select, rename
  } = props;
  return (
    <div className="p-2 border-bottom d-flex flex-row justify-content-between">
      <div className="cursor-pointer" onClick={() => select(collection)}>
        {collection.name}
      </div>
      <div>
        <EditIcon className="cursor-pointer" onClick={() => rename(collection.id)} />
        <DeleteIcon className="cursor-pointer" onClick={() => doDelete(collection.id)} />
      </div>
    </div>
  );
};

Collection.propTypes = {
  collection: collectionPropType.isRequired,
  doDelete: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  rename: id => dispatch(beginEditCollectionName(id)),
  doDelete: id => dispatch(setDeletingCollectionID(id)),
  select: collection => dispatch(selectCollection(collection)),
});

export default connect(null, mapDispatchToProps)(Collection);
