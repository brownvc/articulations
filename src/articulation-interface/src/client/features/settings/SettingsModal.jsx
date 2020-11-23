import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form } from 'react-bootstrap';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  setDatasetTileSize, setCollectionTileSize, setUsePrerenderedThumbnails, hideSettings
} from './settingsSlice';

const SettingsModal = (props) => {
  const {
    datasetTileSize, collectionTileSize, setDatasetSize, setCollectionSize, showingSettings, hide,
    usePrerenderedThumbnails, setThumbnails,
  } = props;

  const tileSizeOptions = () => (
    <>
      <option value={50}>Tiny (50 px)</option>
      <option value={75}>Small (75 px)</option>
      <option value={100}>Medium (100 px)</option>
      <option value={200}>Large (200 px)</option>
      <option value={300}>Huge (300 px)</option>
      <option value={500}>Huger (500 px)</option>
      <option value={800}>Hugest (800 px)</option>
    </>
  );

  // Gets the username from localStorage.
  const username = window.localStorage.getItem('username') || 'unspecified';
  const usernameInput = React.createRef();

  return (
    <Modal
      show={showingSettings}
      onHide={() => {
        // Saves the username to localStorage before hiding the modal.
        window.localStorage.setItem('username', usernameInput.current.value || 'unspecified');
        hide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <SettingsIcon className="text-secondary mr-2" />
          Interface Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Dataset Tile Size</Form.Label>
          <Form.Control
            as="select"
            value={datasetTileSize}
            onChange={e => setDatasetSize(parseInt(e.target.value, 10))}
          >
            {tileSizeOptions()}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Collection Tile Size</Form.Label>
          <Form.Control
            as="select"
            value={collectionTileSize}
            onChange={e => setCollectionSize(parseInt(e.target.value, 10))}
          >
            {tileSizeOptions()}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control defaultValue={username} ref={usernameInput} />
        </Form.Group>

        <Form.Check
          checked={usePrerenderedThumbnails}
          type="checkbox"
          label="Use prerendered animation thumbnails instead of WebGL view in the rule editor"
          onChange={e => setThumbnails(e.target.checked)}
        />
      </Modal.Body>
    </Modal>
  );
};

SettingsModal.propTypes = {
  showingSettings: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  datasetTileSize: PropTypes.number.isRequired,
  collectionTileSize: PropTypes.number.isRequired,
  setDatasetSize: PropTypes.func.isRequired,
  setCollectionSize: PropTypes.func.isRequired,
  usePrerenderedThumbnails: PropTypes.bool.isRequired,
  setThumbnails: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  showingSettings: state.settingsSlice.showingSettings,
  datasetTileSize: state.settingsSlice.datasetTileSize,
  collectionTileSize: state.settingsSlice.collectionTileSize,
  usePrerenderedThumbnails: state.settingsSlice.usePrerenderedThumbnails,
  username: state.settingsSlice.username,
});

const mapDispatchToProps = {
  setDatasetSize: setDatasetTileSize,
  setCollectionSize: setCollectionTileSize,
  setThumbnails: setUsePrerenderedThumbnails,
  hide: hideSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
