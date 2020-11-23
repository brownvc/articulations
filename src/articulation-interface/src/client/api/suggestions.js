import PropTypes from 'prop-types';
import Constants from '../util/Constants';
import suggestionPropType from '../features/collectionView/suggestionView/suggestionPropType';
import postWithUsername from './postWithUsername';
import { tasks } from '../features/jointView/taskFilter';

// Calls the server's API to get suggestions.
const getSuggestions = (collectionID, source, category, partLabel, taskName) => {
  const body = {
    collection_id: collectionID,
    source,
    category,
    part_label: partLabel,
  };
  if (taskName) {
    const objectIDs = tasks[taskName] || [];
    body.object_ids = objectIDs;
  }
  if (source === undefined) {
    delete body.source;
  }
  if (category === undefined) {
    delete body.category;
  }
  if (category === undefined) {
    delete body.part_label;
  }
  return postWithUsername(`${Constants.baseURL}/articulation-program/collection/joint/suggestions`, body).then(r => r.json()).then((json) => {
    // Parses the suggestions.
    if (!Array.isArray(json)) {
      throw new TypeError(`Did not receive an array when fetching suggestions for collection ${collectionID}.`);
    }

    // Converts everything to numbers.
    const suggestions = [];
    json.forEach(suggestion => suggestions.push({
      collection_id: parseInt(suggestion.collection_id, 10),
      decision: suggestion.decision,
      joint: {
        base_part_id: parseInt(suggestion.base_part_id, 10),
        base_part_index: parseInt(suggestion.base_part_index, 10),
        moving_part_id: parseInt(suggestion.moving_part_id, 10),
        moving_part_index: parseInt(suggestion.moving_part_index, 10),
        full_id: suggestion.full_id,
      }
    }));

    // Validates the suggestions.
    PropTypes.checkPropTypes(PropTypes.arrayOf(suggestionPropType).isRequired, suggestions, 'suggestions', 'getSuggestions');
    return suggestions;
  }).catch((e) => {
    console.error(e);
  });
};

const rejectSuggestion = async (collectionID, basePartID, movingPartID) => {
  try {
    const { ok } = await postWithUsername(`${Constants.baseURL}/articulation-program/collection/joint/reject`, {
      collection_id: collectionID,
      moving_part_id: movingPartID,
      base_part_id: basePartID,
    });
    if (!ok) {
      alert("Sending a suggestion's rejection to the learner failed. See the console for more details.");
    }
  } catch (err) {
    alert("Sending a suggestion's rejection to the learner failed. See the console for more details.");
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getSuggestions, rejectSuggestion };
