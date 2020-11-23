import React from 'react';
import { connect, useSelector } from 'react-redux';
import { PropTypes } from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import Spacer from './Spacer';
import Label from './Label';
import ConnectedSelect from '../../../components/ConnectedSelect';
import OptionsFromStringArray from '../../../components/OptionsFromStringArray';
import {
  setObjectCategory, setPartLabel, setGrouping, setDataSource, setCollection
} from './filtersSlice';
import { removeDetailSelection } from '../detailView/detailSlice';
import { showSettings } from '../../settings/settingsSlice';
import Legend from '../../../components/Legend';
import collectionPropType from '../../collectionView/collectionPropType';
import SessionButton from '../../session/SessionButton';
import '../../../components/util.scss';

const FilterBar = (props) => {
  const {
    mappedSetObjectCategory, mappedSetPartLabel, mappedSetGrouping,
    deselectDetail, showSettingsModal, objectCategoryMap,
    partLabelMap, collections, mappedSetCollection
  } = props;

  const filters = useSelector(state => state.jointView.filters);

  // Figures out which object categories should be shown.
  let validCategories = [];
  if (!filters.dataSource) {
    validCategories = Object.keys(objectCategoryMap);
  } else {
    Object.entries(objectCategoryMap).forEach((entry) => {
      const [category, dataSets] = entry;
      if (dataSets.includes(filters.dataSource)) {
        validCategories.push(category);
      }
    });
  }

  // Figures out which part labels should be shown.
  let validPartLabels = [];
  if (!filters.dataSource) {
    validPartLabels = Object.keys(partLabelMap);
  } else {
    Object.entries(partLabelMap).forEach((entry) => {
      const [partLabel, dataSets] = entry;
      if (dataSets.includes(filters.dataSource)) {
        validPartLabels.push(partLabel);
      }
    });
  }

  // Adds the currently selected filters to the lists if they're not there already.
  // This lets the user see that the new dataset does not contain what they're looking for.
  if (!validCategories.includes(filters.objectCategory) && filters.objectCategory) {
    validCategories.push(filters.objectCategory);
  }
  if (!validPartLabels.includes(filters.partLabel) && filters.partLabel) {
    validPartLabels.push(filters.partLabel);
  }

  // Figures out what collections should be shown.
  return (
    <div className="bg-dark text-light p-2 d-flex flew-row flex-shrink-0 align-items-center">
      <SessionButton />

      <Spacer />

      <Legend />

      <Spacer />

      <Label text="Filters:" className="mr-2" />

      <ConnectedSelect
        placeholderText="Object Category"
        className="mr-2"
        value={filters.objectCategory}
        setFunction={(value) => {
          deselectDetail();
          mappedSetObjectCategory(value);
        }}
        disabled={validCategories.length === 0}
        size="sm"
      >
        <OptionsFromStringArray options={validCategories} />
      </ConnectedSelect>

      <ConnectedSelect
        placeholderText="Part Label"
        value={filters.partLabel}
        className="mr-2"
        setFunction={(value) => {
          deselectDetail();
          mappedSetPartLabel(value);
        }}
        disabled={validPartLabels.length === 0}
        size="sm"
      >
        <OptionsFromStringArray options={validPartLabels} />
      </ConnectedSelect>

      <ConnectedSelect
        placeholderText="Collection Name"
        value={filters.collection}
        setFunction={(value) => {
          deselectDetail();
          mappedSetCollection(value);
        }}
        disabled={validPartLabels.length === 0}
        size="sm"
      >
        <option disabled key="@@@Spacer1@@@">──────────</option>
        <option key="@@@Any@@@Collection@@@">Any Collection</option>
        <option key="@@@No@@@Collection@@@">No Collection</option>
        <option disabled key="@@@Spacer2@@@">──────────</option>
        <OptionsFromStringArray options={collections.map(c => c.name)} />
      </ConnectedSelect>

      <Spacer />

      <Label text="Grouping:" className="mr-2" />
      <ConnectedSelect
        value={filters.grouping}
        setFunction={(value) => {
          deselectDetail();
          mappedSetGrouping(value);
        }}
        size="sm"
      >
        <OptionsFromStringArray options={['Object', 'Object Category', 'Part Label']} />
      </ConnectedSelect>

      <Spacer />

      <SettingsIcon className="cursor-pointer" onClick={showSettingsModal} />
    </div>
  );
};

FilterBar.propTypes = {
  mappedSetObjectCategory: PropTypes.func.isRequired,
  mappedSetPartLabel: PropTypes.func.isRequired,
  mappedSetGrouping: PropTypes.func.isRequired,
  mappedSetCollection: PropTypes.func.isRequired,
  deselectDetail: PropTypes.func.isRequired,
  showSettingsModal: PropTypes.func.isRequired,
  objectCategoryMap: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  ).isRequired,
  partLabelMap: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  ).isRequired,
  collections: PropTypes.arrayOf(collectionPropType),
};

FilterBar.defaultProps = {
  collections: [],
};

const mapStateToProps = state => ({
  dataSources: state.jointView.joints.dataSources,
  objectCategoryMap: state.jointView.joints.objectCategories,
  partLabelMap: state.jointView.joints.partLabels,
  collections: state.collectionView.collections.collections,
});

const mapDispatchToProps = {
  mappedSetObjectCategory: setObjectCategory,
  mappedSetPartLabel: setPartLabel,
  mappedSetGrouping: setGrouping,
  mappedSetDataSource: setDataSource,
  mappedSetCollection: setCollection,
  deselectDetail: removeDetailSelection,
  showSettingsModal: showSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
