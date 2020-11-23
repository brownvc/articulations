import React, { Component } from 'react';
import { Popover } from 'react-bootstrap';
import { partAndObjectInformationPropType } from './PartTile';
import Constants from '../../util/Constants';
import CenteredSpinner from '../CenteredSpinner';
import BasePartTile from './BasePartTile';
import '../util.scss';

export default class MovingPartTilePopoverContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      baseParts: undefined,
    };
  }

  componentDidMount() {
    const { subject } = this.props;
    fetch(`${Constants.baseURL}/articulation-program/parts/base_parts?moving_part_id=${subject.part.part_id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(response => response.json()).then((baseParts) => {
      this.setState({
        loaded: true,
        baseParts,
      });
    });
  }

  popoverContent() {
    const { loaded, baseParts } = this.state;
    const { subject } = this.props;

    // Returns a spinner if the base parts aren't loaded yet.
    if (!loaded) {
      return <CenteredSpinner />;
    }

    // Returns a message if there are no base parts.
    if (baseParts.length === 0) {
      return 'This moving part has no base parts. 😥';
    }

    // Creates a tile for each base part.
    const basePartTiles = [];
    baseParts.forEach((basePart) => {
      const partAndObjectInformation = {
        full_id: subject.full_id,
        part: {
          part_id: basePart.base_part_id,
          part_index: basePart.base_part_index,
          part_label: basePart.base_part_label,
          render_hash: null,
          collection_id: null,
        },
      };
      basePartTiles.push(<BasePartTile
        key={partAndObjectInformation.part.part_id}
        subject={partAndObjectInformation}
      />);
    });
    return (
      <div className="overflow-hidden flex-grow-1">
        <div className="w-100 h-100 overflow-x-scroll overflow-scroll d-flex flex-row">
          {basePartTiles}
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <Popover.Title as="h3">Select base part.</Popover.Title>
        <Popover.Content className="d-flex">
          {this.popoverContent()}
        </Popover.Content>
      </>
    );
  }
}

MovingPartTilePopoverContents.propTypes = {
  subject: partAndObjectInformationPropType.isRequired,
};
