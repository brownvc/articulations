import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import collectionPropType from './collectionPropType';
import Collection from './Collection';
import ViewHeader from '../../components/ViewHeader';
import { beginCreateNewCollection } from './collectionsSlice';
import CenteredSpinner from '../../components/CenteredSpinner';

const CollectionList = (props) => {
  const { collections, create } = props;

  // Draws nothing if collections is undefined.
  if (!Array.isArray(collections)) {
    return <CenteredSpinner />;
  }

  // Creates an element for each collection.
  const collectionElements = [];
  collections.forEach((collection) => {
    collectionElements.push(<Collection key={collection.id} collection={collection} />);
  });

  return (
    <div className="w-100 h-100">
      <div className="d-flex flex-row justify-content-between align-items-center border-bottom">
        <ViewHeader>Collections</ViewHeader>
        <ControlPointIcon className="m-2 cursor-pointer" onClick={create} />
      </div>
      {collectionElements}
    </div>
  );
};

CollectionList.propTypes = {
  collections: PropTypes.arrayOf(collectionPropType),
  create: PropTypes.func.isRequired,
};

CollectionList.defaultProps = {
  collections: undefined,
};

const mapDispatchToProps = dispatch => ({
  create: () => dispatch(beginCreateNewCollection()),
});

export default connect(null, mapDispatchToProps)(CollectionList);
