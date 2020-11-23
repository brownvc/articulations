import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toggleVisualizationMode } from './editorSlice';
import rulePropType from './rulePropType';

const VisualizationButton = (props) => {
  const {
    toggle, inVisualizationMode, collectionRules, inProgress, state, ...otherProps
  } = props;

  let axisRulesExist = false;
  let rangeRulesExist = false;
  collectionRules.find((rule) => {
    axisRulesExist = axisRulesExist || rule.type === 'Axis';
    rangeRulesExist = rangeRulesExist || rule.type === 'Range';

    // This short-circuits the search if both axis and range rules exist.
    return axisRulesExist && rangeRulesExist;
  });

  return (
    <Button
      onClick={() => toggle(state)}
      disabled={!(axisRulesExist || rangeRulesExist) || inProgress}
      variant="primary"
      size="sm"
      {...otherProps}
    >
      {
        inProgress ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-2"
          />
        ) : null
      }
      {inVisualizationMode ? 'Stop Previewing' : 'Preview Rule on Selected Joints'}
    </Button>
  );
};

VisualizationButton.propTypes = {
  collectionRules: PropTypes.arrayOf(rulePropType),
  toggle: PropTypes.func.isRequired,
  inVisualizationMode: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,

  // I really don't want to type out a million PropTypes for the stuff enterVisualizationMode needs.
  // eslint-disable-next-line react/forbid-prop-types
  state: PropTypes.any,
};

VisualizationButton.defaultProps = {
  collectionRules: [],
  state: undefined,
};

const mapStateToProps = state => ({
  collectionRules: state.editorView.rules,
  inVisualizationMode: state.editorView.inVisualizationMode,
  inProgress: state.editorView.gettingVisualization,
  state,
});

const mapDispatchToProps = dispatch => ({
  toggle: state => dispatch(toggleVisualizationMode(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationButton);
