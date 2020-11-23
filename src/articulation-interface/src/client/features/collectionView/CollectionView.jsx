import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { fetchCollections, beginCreateNewCollection } from './collectionsSlice';
import collectionPropType from './collectionPropType';
import CollectionList from './CollectionList';
import CollectionDetail from './CollectionDetail';
import SplitPane from '../../components/SplitPane';
import SuggestionView from './suggestionView/SuggestionView';

const CollectionView = (props) => {
  const {
    collectionsLoaded,
    collections,
    mappedFetchCollections,
    selectedCollectionID,
    showingSuggestions,
  } = props;

  // Fetches collections upon loading.
  if (!collectionsLoaded) {
    mappedFetchCollections();
  }

  // Picks the right CollectionDetail (with or without a SplitPane and suggestions).
  const withSuggestions = () => (
    <SplitPane direction="vertical">
      <CollectionDetail />
      <SuggestionView />
    </SplitPane>
  );
  const collectionDetail = showingSuggestions ? withSuggestions() : <CollectionDetail />;

  return (
    <div className="w-100 h-100">
      {selectedCollectionID ? collectionDetail : <CollectionList collections={collections} />}
    </div>
  );
};

CollectionView.propTypes = {
  collectionsLoaded: PropTypes.bool.isRequired,
  collections: PropTypes.arrayOf(collectionPropType),
  mappedFetchCollections: PropTypes.func.isRequired,
  selectedCollectionID: PropTypes.number,
  showingSuggestions: PropTypes.bool.isRequired,
};

CollectionView.defaultProps = {
  selectedCollectionID: undefined,
  collections: undefined,
};

const mapStateToProps = state => ({
  collectionsLoaded: state.collectionView.collections.collectionsLoaded,
  collections: state.collectionView.collections.collections,
  selectedCollectionID: state.collectionView.collections.selectedCollectionID,
  showingSuggestions: state.collectionView.collections.showingSuggestions,
});

const mapDispatchToProps = dispatch => ({
  mappedFetchCollections: () => dispatch(fetchCollections()),
  mappedBeginCreateNewCollection: () => dispatch(beginCreateNewCollection()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionView);
