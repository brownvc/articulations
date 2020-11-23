/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './WebGLWrapper.scss';
import * as THREE from '../../../../stk/three.min';
import jointPropType, { makeJointID } from '../collectionView/jointPropType';
import internalArticulationPropType from '../editorView/internalArticulationPropType';
import { setJointLoaded } from '../editorView/editorSlice';
import attributePropType from '../editorView/jointAttributes/attributePropType';

// More best practices...
window.THREE = THREE;
window.globals = {
  base_url: '/stk'
};

class WebGLWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasRef: undefined,
      containerRef: undefined,
    };
    this.glView = undefined;
    this.unAddedJointIDs = Object.keys(props.refs);
    console.log('WebGL Wrapper: Constructor');

    // This holds all of the articulation that have been sent to the MMV.
    // Articulations are only sent to MMV (and this is only updated) if
    // they're different from what's in savedArticulations.
    this.savedArticulations = new Map();
  }

  componentDidUpdate(prevProps) {
    const { canvasRef, containerRef } = this.state;
    const {
      joints, refs, suggestedArticulations, visualizedArticulations, useVisualizedArticulations,
      paused, showWorldXYZ, showAttributes, attributes
    } = this.props;

    const showingAttribute = Object.values(showAttributes).find(k => k === true) || false;

    // Updates show XYZ for the joints.
    if (this.glView) {
      joints.forEach((joint) => {
        const jointInfo = this.makeJointInfo(joint);
        const jointID = makeJointID(joint);
        this.glView.showXYZ(jointInfo, showWorldXYZ);

        // Adds any attributes that are shown.
        const jointAttributes = attributes[jointID];
        const updateAttribute = (name, type) => {
          const nowShown = showAttributes[name] || false;
          const previouslyShown = prevProps.showAttributes[name] || false;
          if (nowShown && !previouslyShown) {
            if (type === 'point') {
              this.glView.showPoint(jointInfo, true, `${jointID}//${name}`, {
                location: jointAttributes[name],
                color: 0xff0000,
                opacity: 0.8,
                size: 0.05,
              });
            } else if (type === 'axis') {
              this.glView.showArrow(jointInfo, true, `${jointID}//${name}`, {
                location: jointAttributes[name.replace('direction', 'bottom')],
                direction: jointAttributes[name],
                length: jointAttributes[name.replace('direction', 'length')],
                color: 0xff0000,
                opacity: 0.8,
                size: 0.05,
              });
            }
          } else if (!nowShown && previouslyShown) {
            if (type === 'point') {
              this.glView.showPoint(jointInfo, false, `${jointID}//${name}`);
            } else if (type === 'axis') {
              this.glView.showArrow(jointInfo, false, `${jointID}//${name}`);
            }
          }
        };
        if (jointAttributes) {
          updateAttribute('contact_center', 'point');
          ['base', 'moving'].forEach((partType) => {
            updateAttribute(`${partType}_center`, 'point');
            [1, 2, 3].forEach((axisNumber) => {
              updateAttribute(`${partType}_axis${axisNumber}_bottom`, 'point');
              updateAttribute(`${partType}_axis${axisNumber}_top`, 'point');
              updateAttribute(`${partType}_axis${axisNumber}_direction`, 'axis');
            });
          });
        }
      });
    }

    // Checks if models need to be loaded.
    // The way the interface is currently set up, this will never be necessary (since WebGLWrapper
    // is reconstructed each time the editor is opened, and the joints in the collection can't
    // change while the editor is open).
    const refSet = new Set();
    Object.keys(prevProps.refs).forEach((jointID) => {
      refSet.add(jointID);
    });
    Object.keys(refs).forEach((jointID) => {
      if (!refSet.has(jointID)) {
        this.unAddedJointIDs.push(jointID);
      }
    });

    // Creates the MultiModelView once everything is loaded.
    if (this.glView === undefined && canvasRef && containerRef) {
      const STK = require('../../../../stk/MultiModelView.bundle');
      try {
        this.glView = new STK.MultiModelView(canvasRef, containerRef);
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert('Creating a MultiModelView from STK caused a crash.');
        console.log('WebGL Wrapper: Error', err);
      }
    }

    // Adds any unadded objects to the MultiModelView once it's ready.
    if (this.glView && this.unAddedJointIDs.length > 0) {
      // Maps joint IDs to joints.
      const jointIdsToJoints = new Map();
      joints.forEach((joint) => {
        jointIdsToJoints.set(makeJointID(joint), joint);
      });

      this.unAddedJointIDs.forEach((jointID) => {
        const joint = jointIdsToJoints.get(jointID);
        if (!joint) {
          // The WebGLWrapper's props shouldn't have refs for deleted tiles, but they do.
          // This prevents refs for deleted tiles from causing crashes.
          return;
        }
        try {
          // Adds the model joint.
          this.addModelJointWrapper(this.glView, {
            modelId: joint.full_id,
            movingPartId: joint.moving_part_index,
            basePartId: joint.base_part_index,
            element: refs[jointID]
          }, joint);
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert('Adding a joint to a MultiModelView from STK caused a crash.');
          console.log('WebGL Wrapper: Error', err);
        }
      });
      this.unAddedJointIDs = [];
    }

    if (this.glView) {
      // Plays or pauses the animations.
      this.glView.setStaticMode(paused);

      // Slow automatic camera rotation is disabled for now to avoid confusion.
      this.glView.setAutoRotate(false);

      // Updates all articulations.
      joints.forEach((joint) => {
        // Whether an axis and origin exist is used as a proxy for whether an articulation exists.
        let { articulation } = joint;
        const jointID = makeJointID(joint);

        // Checks if there's a suggestion that should be displayed instead.
        if (suggestedArticulations[jointID]) {
          articulation = suggestedArticulations[jointID];
        }

        // Visualized articulations take precedence over everything else.
        if (useVisualizedArticulations) {
          // This could be undefined if nothing has been visualized yet; that's fine.
          articulation = visualizedArticulations[jointID];
        }

        // But actually, joint attributes take absolute precedence.
        if (showingAttribute) {
          articulation = undefined;
        }

        // At this point, the UI knows which articulation needs to be displayed.
        // Now, it needs to check whether the new articulation is actually different.
        const previousArticulation = this.savedArticulations.get(jointID);
        // eslint-disable-next-line max-len
        const shouldUpdateArticulation = JSON.stringify(articulation) !== JSON.stringify(previousArticulation);
        if (shouldUpdateArticulation) {
          this.savedArticulations.set(jointID, articulation);
        }
        if (shouldUpdateArticulation) {
          if (articulation && articulation.axis && articulation.origin) {
            // This translates between the database motion types and STK's.
            const motionTypes = {
              Translation: 'Translation',
              Rotation: 'Hinge Rotation',
            };

            // Converts the articulation information to STK's format.
            const formattedArticulation = {
              pid: joint.moving_part_index,
              type: motionTypes[articulation.motionType],
              origin: {
                x: articulation.origin[0],
                y: articulation.origin[1],
                z: articulation.origin[2],
              },
              axis: {
                x: articulation.axis[0],
                y: articulation.axis[1],
                z: articulation.axis[2],
              },
              base: [joint.base_part_index],
              rangeMin: articulation.minRange || 0,
              rangeMax: articulation.maxRange || 0,
              ref: articulation.ref || null,
              defaultValue: articulation.currentPose,
            };

            // Gives the MMV a null range so that it can special-case the blue dot.
            if (!articulation.rangeRuleID) {
              formattedArticulation.rangeMin = null;
              formattedArticulation.rangeMax = null;
            }

            // Adds the model joint's articulation.
            // The naming conventions go out the window here lol.
            this.setArticulationWrapper(this.glView, {
              modelId: joint.full_id,
              movingPartId: joint.moving_part_index,
              basePartId: joint.base_part_index,
              articulations: [formattedArticulation]
            });
          } else {
            const dummyArticulation = {
              pid: joint.moving_part_index,
              type: 'fixed',
              origin: {
                x: 0,
                y: 0,
                z: 0
              },
              axis: {
                x: 0,
                y: 0,
                z: 0
              },
              base: [joint.base_part_index],
              rangeMin: 0,
              rangeMax: 0,
              ref: [0, 0, 0],
              defaultValue: 0,
            };

            // This sets no articulation for the joint.
            this.setArticulationWrapper(this.glView, {
              modelId: joint.full_id,
              movingPartId: joint.moving_part_index,
              basePartId: joint.base_part_index,
              articulations: [dummyArticulation]
            });
          }
        }
      });
    }
  }

  addModelJointWrapper = (view, jointInfo, joint) => {
    console.log('WebGL Wrapper: Feeding STK joint.', jointInfo);
    const { setLoaded } = this.props;
    view.addModelJoint(jointInfo, () => {
      setLoaded(makeJointID(joint));
    });
  }

  setArticulationWrapper = (view, articulation) => {
    console.log('WebGL Wrapper: Feeding STK articulations.', articulation);
    view.setArticulations(articulation);
  }

  makeJointInfo(joint) {
    const { refs } = this.props;
    return {
      modelId: joint.full_id,
      movingPartId: joint.moving_part_index,
      basePartId: joint.base_part_index,
      element: refs[makeJointID(joint)]
    };
  }

  render() {
    return (
      <div className="w-100 h-100 position-absolute">
        <canvas
          className="w-100 h-100 position-absolute z-index-2 transparent-canvas"
          ref={(newCanvasRef) => {
            // Sets the canvas ref only once.
            // Triggers componentDidUpdate.
            const { canvasRef } = this.state;
            if (!canvasRef) {
              this.setState({
                canvasRef: newCanvasRef,
              });
            }
          }}
        />
        <div
          className="w-100 h-100 position-absolute z-index-1"
          ref={(newContainerRef) => {
            // Sets the container ref only once.
            // Triggers componentDidUpdate.
            const { containerRef } = this.state;
            if (!containerRef) {
              this.setState({
                containerRef: newContainerRef,
              });
            }
          }}
        />
      </div>
    );
  }
}

WebGLWrapper.propTypes = {
  refs: PropTypes.objectOf(PropTypes.instanceOf(Element).isRequired),
  joints: PropTypes.arrayOf(jointPropType),
  suggestedArticulations: PropTypes.objectOf(internalArticulationPropType.isRequired).isRequired,
  visualizedArticulations: PropTypes.objectOf(internalArticulationPropType.isRequired).isRequired,
  useVisualizedArticulations: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  setLoaded: PropTypes.func.isRequired,
  showAttributes: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  showWorldXYZ: PropTypes.bool.isRequired,
  attributes: PropTypes.objectOf(attributePropType.isRequired).isRequired,
};

WebGLWrapper.defaultProps = {
  refs: {},
  joints: [],
};

const mapState = (state) => {
  const { selectedCollectionID, collections } = state.collectionView.collections;
  return {
    joints: collections.find(c => c.id === selectedCollectionID).joints,
    suggestedArticulations: state.editorView.suggestedArticulations,
    visualizedArticulations: state.editorView.visualizedArticulations,
    useVisualizedArticulations: state.editorView.inVisualizationMode,
    paused: state.editorView.animationPaused,
    showWorldXYZ: state.jointAttributesSlice.showWorldXYZ,
    showAttributes: state.jointAttributesSlice.show,
    attributes: state.jointAttributesSlice.attributes,
  };
};

const mapDispatch = {
  setLoaded: setJointLoaded,
};

export default connect(mapState, mapDispatch)(WebGLWrapper);
