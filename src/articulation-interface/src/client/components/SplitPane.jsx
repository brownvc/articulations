/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import './SplitPane.scss';
import './util.scss';

export default class SplitPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLength: undefined,
      secondLength: undefined,
    };
    this.separatorStartPosition = null;
    this.firstPaneRef = React.createRef();
    this.secondPaneRef = React.createRef();
    this.containerRef = React.createRef();
    this.separatorRef = React.createRef();
  }

  // Adds mouse move and up listeners to the document.
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('resize', this.updateDimensions.bind(this));

    // Sets the initial firstLength to 50%.
    const totalLength = this.isHorizontal ? this.containerRef.current.clientWidth
      : this.containerRef.current.clientHeight;
    const separatorLength = this.isHorizontal ? this.separatorRef.current.clientWidth
      : this.separatorRef.current.clientHeight;
    const firstLength = totalLength * 0.5 - separatorLength * 0.5;
    const secondLength = totalLength - separatorLength - firstLength;
    this.setState({
      firstLength,
      secondLength,
    });
  }

  // Removes mouse move and up listeners from the document.
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  get isHorizontal() {
    const { direction } = this.props;
    return direction === 'horizontal';
  }

  // Saves the separator's position so that offsets can be calculated later.
  onMouseDown = (e) => {
    this.separatorStartPosition = this.isHorizontal ? e.clientX : e.clientY;
  };

  // Calculates the panes' new sizes.
  onMouseMove = (e) => {
    // Exits if the separator position hasn't been set.
    if (!this.separatorStartPosition) {
      return;
    }

    // Records values needed for computation.
    const { firstLength } = this.state;
    const { minimum } = this.props;
    const totalLength = this.isHorizontal
      ? this.containerRef.current.clientWidth : this.containerRef.current.clientHeight;
    const separatorLength = this.isHorizontal
      ? this.separatorRef.current.clientWidth : this.separatorRef.current.clientHeight;
    const separatorPosition = this.isHorizontal ? e.clientX : e.clientY;

    // Calculates the panes' lengths.
    const unconstrainedFirstLength = firstLength + separatorPosition - this.separatorStartPosition;
    const minFirstLength = (minimum || 0);
    const maxFirstLength = totalLength - separatorLength - (minimum || 0);
    const newFirstLength = Math.max(
      minFirstLength, Math.min(maxFirstLength, unconstrainedFirstLength)
    );
    const newSecondLength = totalLength - separatorLength - newFirstLength;

    // Updates the state.
    this.separatorStartPosition = separatorPosition;
    this.setState({
      firstLength: newFirstLength,
      secondLength: newSecondLength,
    });
  };

  // Stops dragging.
  onMouseUp = () => {
    this.separatorStartPosition = undefined;
  };

  updateDimensions() {
    if (!this.firstPaneRef.current || !this.containerRef.current || !this.separatorRef.current) {
      return;
    }
    const firstLength = this.isHorizontal
      ? this.firstPaneRef.current.clientWidth : this.firstPaneRef.current.clientHeight;
    const totalLength = this.isHorizontal
      ? this.containerRef.current.clientWidth : this.containerRef.current.clientHeight;
    const separatorLength = this.isHorizontal
      ? this.separatorRef.current.clientWidth : this.separatorRef.current.clientHeight;

    // Updates the state.
    this.setState({
      firstLength,
      secondLength: totalLength - separatorLength - firstLength,
    });
  }

  render() {
    const { children } = this.props;
    const { firstLength, secondLength } = this.state;

    let containerClass = 'flex-column';
    let handleClass = 'handle-horizontal';
    let firstPaneStyle = {
      height: firstLength,
    };
    let secondPaneStyle = {
      height: secondLength,
    };
    if (this.isHorizontal) {
      containerClass = 'flex-row';
      handleClass = 'handle-vertical';
      firstPaneStyle = {
        width: firstLength,
      };
      secondPaneStyle = {
        width: secondLength,
      };
    }
    return (
      <div className={`w-100 h-100 split-pane d-flex ${containerClass}`} ref={this.containerRef}>
        <div style={firstPaneStyle} className="overflow-hidden" ref={this.firstPaneRef}>
          {children[0]}
        </div>
        <div className={handleClass} ref={this.separatorRef} onMouseDown={this.onMouseDown} />
        <div style={secondPaneStyle} className="overflow-hidden" ref={this.secondPaneRef}>
          {children[1]}
        </div>
      </div>
    );
  }
}

SplitPane.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  minimum: PropTypes.number,
};

SplitPane.defaultProps = {
  direction: 'horizontal',
  minimum: 100,
};
