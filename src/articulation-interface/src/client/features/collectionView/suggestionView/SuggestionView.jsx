import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { hideSuggestions } from '../collectionsSlice';
import CenteredSpinner from '../../../components/CenteredSpinner';
import suggestionPropType from './suggestionPropType';
import SuggestionJointTile from '../../../components/tile/SuggestionJointTile';

const SuggestionView = (props) => {
  const { close, fetching, suggestions } = props;

  // Picks the main area's content on what the suggestions are.
  // If fetching suggestions, shows a spinner.
  let content = <CenteredSpinner />;
  if (!fetching) {
    let message;
    if (Array.isArray(suggestions)) {
      if (suggestions.length === 0) {
        // An empty array indicates that there were simply no suggestions.
        message = 'No suggestions to show.';
      } else {
        // This is the case where there are valid suggestions.
        const tiles = [];
        suggestions.forEach(suggestion => tiles.push(<SuggestionJointTile key={`${suggestion.joint.moving_part_id}.${suggestion.joint.base_part_id}`} joint={suggestion.joint} />));
        content = (
          <div className="overflow-scroll d-flex flex-row p-1 flex-wrap w-100">
            {tiles}
          </div>
        );
      }
    } else {
      // Undefined or malformed suggestions indicate a problem.
      message = 'An error occurred when fetching suggestions. See the console for more details.';
    }

    // If a message was set, sets the content to be the message.
    if (message) {
      content = (
        <div className="w-100 d-flex flex-grow-1 justify-content-center align-items-center">
          <div className="mx-5">{message}</div>
        </div>
      );
    }
  }

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between align-items-center p-1 border-bottom">
        <h4 className="m-1">Suggested Joints</h4>
        <CloseIcon className="m-1 cursor-pointer" onClick={close} />
      </div>
      {content}
    </div>
  );
};

SuggestionView.propTypes = {
  close: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(suggestionPropType),
};

SuggestionView.defaultProps = {
  suggestions: undefined,
};

const mapStateToProps = state => ({
  fetching: state.collectionView.collections.fetchingSuggestions,
  suggestions: state.collectionView.collections.suggestions,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(hideSuggestions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionView);
