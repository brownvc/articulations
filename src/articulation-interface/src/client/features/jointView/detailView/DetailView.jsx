import React from 'react';
import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import ViewHeader from '../../../components/ViewHeader';
import MovingPartTile from '../../../components/tile/MovingPartTile';
import { selectionPropType, removeDetailSelection } from './detailSlice';
import filterJoints from '../../../util/filterJoints';
import filtersPropType from '../filterBar/filtersPropType';
import collectionPropType from '../../collectionView/collectionPropType';
import '../../../components/util.scss';

const DetailView = ({
  selection, dataset, filters, close, collections
}) => {
  if (!dataset) {
    // Something went horribly wrong...
    return null;
  }

  const collectionPartIDs = new Set();
  if (filters.collection) {
    let targetCollections = collections;
    if (filters.collection !== 'Any Collection' && filters.collection !== 'No Collection') {
      targetCollections = collections.filter(c => c.name === filters.collection);
    }
    targetCollections.forEach((collection) => {
      collection.joints.forEach((joint) => {
        collectionPartIDs.add(joint.base_part_id);
        collectionPartIDs.add(joint.moving_part_id);
      });
    });
  }

  const tiles = [];
  if (dataset) {
    const filteredJoints = filterJoints(dataset, filters, collections, selection);
    filteredJoints.forEach((object) => {
      object.parts.forEach((part) => {
        // Does the part filtering for collection filters.
        if (filters.collection) {
          if (filters.collection === 'No Collection') {
            if (collectionPartIDs.has(part.part_id)) {
              return;
            }
          } else if (!collectionPartIDs.has(part.part_id)) {
            return;
          }
        }
        const subject = {
          source: object.source,
          full_id: object.full_id,
          object_id: object.object_id,
          part,
        };
        tiles.push(<MovingPartTile key={part.part_id} subject={subject} />);
      });
    });
  }

  const header = () => (
    <ViewHeader>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div>
          {`Parts for ${selection.selectionType} `}
          {selection.selectionType === 'Object' ? null : (
            <Badge variant="primary">
              {`${selection.selection}`}
            </Badge>
          )}
        </div>
        <CloseIcon className="cursor-pointer" onClick={close} />
      </div>
    </ViewHeader>
  );

  return (
    <div className="d-flex flex-column w-100 h-100 border-bottom">
      {header()}
      <div className={`overflow-scroll d-flex flex-row p-1 flex-wrap w-100 border-top ${dataset ? null : 'h-100'}`}>
        {tiles}
      </div>
    </div>
  );
};

DetailView.propTypes = {
  selection: selectionPropType.isRequired,
  collections: PropTypes.arrayOf(collectionPropType),
  dataset: PropTypes.any.isRequired,
  filters: filtersPropType.isRequired,
  close: PropTypes.func.isRequired,
};

DetailView.defaultProps = {
  collections: [],
};

const mapStateToProps = state => ({
  collections: state.collectionView.collections.collections,
  selection: state.jointView.detail,
  dataset: state.jointView.joints.unconfirmedJoints,
  filters: state.jointView.filters,
});

const mapDispatchToProps = {
  close: removeDetailSelection,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailView);
