/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { PropTypes } from 'prop-types';
import '../util.scss';
import './Tile.scss';

const Tile = forwardRef((props, ref) => {
  const {
    label, children, thumbnail, selected, clickHandler, tileSize, ...otherProps
  } = props;
  const { tileRef, imageAreaRef } = ref || {};
  const inVisualizationMode = useSelector(state => state.editorView.inVisualizationMode);

  // Calculates additional border classes based on selection.
  let borderClass = null;
  let labelClasses = null;
  if (selected) {
    borderClass = inVisualizationMode ? 'border-success' : 'border-primary';
    labelClasses = `${inVisualizationMode ? 'bg-success' : 'bg-primary'} text-light`;
  }
  const style = {
    height: tileSize,
    minWidth: tileSize,
  };
  if (thumbnail) {
    style.backgroundImage = `url(${thumbnail})`;
  }

  return (
    <div {...otherProps} ref={tileRef} className={`rounded border d-flex flex-column m-1 cursor-pointer ${borderClass}`} onClick={clickHandler}>
      <div className="p-1">
        <div className="tile-img text-secondary" style={style} ref={imageAreaRef}>
          {children}
        </div>
      </div>
      <div className={`border-top px-2 py-1 ${borderClass} ${labelClasses}`}>
        {label}
      </div>
    </div>
  );
});

Tile.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  thumbnail: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
  tileSize: PropTypes.number,
};

Tile.defaultProps = {
  clickHandler: null,
  thumbnail: undefined,
  tileSize: 100,
};

export default Tile;
