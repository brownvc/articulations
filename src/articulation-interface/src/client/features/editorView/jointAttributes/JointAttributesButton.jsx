import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, Dropdown, Badge, Spinner
} from 'react-bootstrap';
import jointPropType, { makeJointID } from '../../collectionView/jointPropType';
import { getJointAttributes, setShowWorldXYZ, setShow } from './jointAttributesSlice';
import attributePropType from './attributePropType';
import CollapsibleHeader from './CollapsibleHeader';
import '../../../components/util.scss';

class JointAttributesButton extends React.Component {
  componentDidMount() {
    const { collectionJoints, getAttributes } = this.props;
    getAttributes(collectionJoints);
  }

  showWorldXyzAxesText = () => (
    <div className="d-flex flex-row align-items-center">
      <div>World&nbsp;</div>
      <Badge variant="danger">X</Badge>
      <Badge variant="success">Y</Badge>
      <Badge variant="primary">Z</Badge>
      <div>&nbsp;axes</div>
    </div>
  );

  partCheckBoxes(name) {
    const { doSetShow, show } = this.props;
    const center = `${name}_center`;

    const axis = (number) => {
      const bottom = `${name}_axis${number}_bottom`;
      const direction = `${name}_axis${number}_direction`;
      const top = `${name}_axis${number}_top`;
      const checked = show[bottom] && show[direction] && show[top];

      return (
        <CollapsibleHeader
          header={`Axis ${number}`}
          checked={checked}
          onChange={() => {
            doSetShow(bottom, !checked);
            doSetShow(direction, !checked);
            doSetShow(top, !checked);
          }}
        >
          <Form.Check
            type="checkbox"
            label="Bottom"
            className="mx-4"
            checked={show[bottom]}
            onChange={e => doSetShow(bottom, e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Direction"
            className="mx-4"
            checked={show[direction]}
            onChange={e => doSetShow(direction, e.target.checked)}
          />
          <Form.Check
            type="checkbox"
            label="Top"
            className="mx-4"
            checked={show[top]}
            onChange={e => doSetShow(top, e.target.checked)}
          />
        </CollapsibleHeader>
      );
    };

    return (
      <>
        <Form.Check
          type="checkbox"
          label="Center"
          className="mx-4"
          checked={show[center]}
          onChange={e => doSetShow(center, e.target.checked)}
        />
        {axis(1)}
        {axis(2)}
        {axis(3)}
      </>
    );
  }

  render() {
    const {
      collectionJoints, getAttributes, showWorldXYZ, doSetShowWorldXYZ, attributes, show, doSetShow,
      ...otherProps
    } = this.props;

    // Checks to see if all the attributes exist.
    const disabled = collectionJoints.some(joint => !attributes[makeJointID(joint)]);
    const showingAttribute = Object.values(show).find(k => k === true) || false;
    return (
      <Dropdown>
        <Dropdown.Toggle disabled={disabled} variant={showingAttribute ? 'warning' : 'secondary'} {...otherProps}>
          {
            disabled ? (
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
          Joint&nbsp;Attributes
        </Dropdown.Toggle>
        <Dropdown.Menu className="p-0">
          <div style={{ maxHeight: '400px' }} className="overflow-scroll">
            <Dropdown.Header>Global</Dropdown.Header>
            <Form.Check
              type="checkbox"
              label={this.showWorldXyzAxesText()}
              className="mx-4"
              checked={showWorldXYZ}
              onChange={e => doSetShowWorldXYZ(e.target.checked)}
            />
            <Dropdown.Divider className="mt-3" />
            <Dropdown.Header>Base Part</Dropdown.Header>
            {this.partCheckBoxes('base')}
            <Dropdown.Divider className="mt-3" />
            <Dropdown.Header>Moving Part</Dropdown.Header>
            {this.partCheckBoxes('moving')}
            <Dropdown.Divider className="mt-3" />
            <Dropdown.Header>Contact Region</Dropdown.Header>
            <Form.Check
              type="checkbox"
              label="Center"
              className="mx-4 mb-3"
              checked={show.contact_center}
              onChange={e => doSetShow('contact_center', e.target.checked)}
            />
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

JointAttributesButton.propTypes = {
  collectionJoints: PropTypes.arrayOf(jointPropType),
  getAttributes: PropTypes.func.isRequired,

  showWorldXYZ: PropTypes.bool.isRequired,
  doSetShowWorldXYZ: PropTypes.func.isRequired,

  attributes: PropTypes.objectOf(attributePropType.isRequired).isRequired,

  doSetShow: PropTypes.func.isRequired,
  show: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
};

JointAttributesButton.defaultProps = {
  collectionJoints: [],
};

const mapState = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    collectionJoints: collections.find(c => c.id === selectedCollectionID).joints,
    showWorldXYZ: state.jointAttributesSlice.showWorldXYZ,
    attributes: state.jointAttributesSlice.attributes,
    show: state.jointAttributesSlice.show,
  };
};

const mapDispatch = dispatch => ({
  getAttributes: joints => dispatch(getJointAttributes(joints)),
  doSetShowWorldXYZ: value => dispatch(setShowWorldXYZ(value)),
  doSetShow: (what, value) => dispatch(setShow({ what, value })),
});

export default connect(mapState, mapDispatch)(JointAttributesButton);
