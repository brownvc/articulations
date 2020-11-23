import React, { useState } from 'react';
import {
  InputGroup, Button
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CenteredSpinner from './CenteredSpinner';
import './util.scss';
import './TileView.scss';

const TileView = (props) => {
  const { children, header, toolbar } = props;
  const numChildren = React.Children.count(children);

  // Figures out the range/page math.
  // Pages are zero-indexed!
  const ITEMS_PER_PAGE = 100;
  const [page, setPage] = useState(0);
  const start = page * ITEMS_PER_PAGE;
  const end = Math.min((page + 1) * ITEMS_PER_PAGE, numChildren);
  const numPages = Math.floor(numChildren / ITEMS_PER_PAGE);
  if (numChildren > 0 && page > numPages) {
    setPage(numPages);
  }

  // If children is undefined, the children are still loading. A spinner is shown.
  // If children is empty, there are no children. A message is shown.
  if (children === undefined) {
    return <CenteredSpinner />;
  }

  // Sets up button functionality.
  const nextPage = () => {
    setPage(page + 1);
  };
  const nextPageDisabled = (end >= numChildren);
  const prevPage = () => {
    setPage(page - 1);
  };
  const prevPageDisabled = (page === 0);

  // Shows the children if they exist.
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-hidden">
      <div className="w-100 d-flex flex-row justify-content-between p-2 border-bottom" style={{ backgroundColor: 'white' }}>
        <div className="h-100 d-flex flex-column justify-content-center">
          {header ? <h3>{header}</h3> : null}
          {numChildren ? `Showing tiles ${start + 1} to ${end} of ${numChildren}.` : 'No tiles to show.'}
        </div>
        <div className="h-100 d-flex flex-column justify-content-end">
          <InputGroup size="sm">
            <InputGroup.Prepend>
              <InputGroup.Text>{`Page ${page + 1} of ${numPages + 1}`}</InputGroup.Text>
            </InputGroup.Prepend>
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                className="d-flex justify-content-center align-items-center"
                onClick={prevPage}
                disabled={prevPageDisabled}
              >
                <ArrowBackIcon className="smaller-icon" />
              </Button>
              <Button
                variant="outline-secondary"
                className="d-flex justify-content-center align-items-center"
                onClick={nextPage}
                disabled={nextPageDisabled}
              >
                <ArrowForwardIcon className="smaller-icon" />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
      {toolbar}
      <div className="w-100 overflow-scroll d-flex flex-row p-1 flex-wrap">
        {React.Children.toArray(children).slice(start, end)}
      </div>
    </div>
  );
};

TileView.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  toolbar: PropTypes.element,
  header: PropTypes.string,
};

TileView.defaultProps = {
  children: undefined,
  toolbar: null,
  header: undefined,
};

export default TileView;
