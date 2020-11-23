import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'react-bootstrap';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { connect } from 'react-redux';
import { setAnimationPaused } from './editorSlice';

const PlayPauseButton = (props) => {
  const {
    variant, setPaused, paused, ...otherProps
  } = props;
  return (
    <ButtonGroup {...otherProps}>
      <Button disabled={!paused} className="py-0 px-1" variant={variant} onClick={() => setPaused(false)}><PlayArrowIcon /></Button>
      <Button disabled={paused} className="py-0 px-1" variant={variant} onClick={() => setPaused(true)}><PauseIcon /></Button>
    </ButtonGroup>
  );
};

PlayPauseButton.propTypes = {
  variant: PropTypes.string,
  setPaused: PropTypes.func.isRequired,
  paused: PropTypes.bool.isRequired,
};

PlayPauseButton.defaultProps = {
  variant: 'primary',
};

const mapStateToProps = state => ({
  paused: state.editorView.animationPaused,
});

const mapDispatchToProps = {
  setPaused: setAnimationPaused,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayPauseButton);
