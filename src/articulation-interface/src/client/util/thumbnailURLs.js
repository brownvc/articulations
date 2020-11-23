import Constants from './Constants';

// These URLs are where various kinds of thumbnails are stored.
const assetPaths = {
  object_screenshot_path: `${Constants.baseURL}/suncg/objects/{modelID}/{modelID}.png`,
  object_articulation_path: 'http://ec2-52-14-172-161.us-east-2.compute.amazonaws.com/articulations/precomputed-articulations/{modelID}/{modelID}.gif',
  object_part_articulation_path: `${Constants.baseURL}/precomputed-articulations/{source}/{modelID}/{modelID}-{partIndex}-{this.renderHash}.gif`,
  object_annotation_viewer_path: `${Constants.baseURL}/motion-viewer?modelId={modelID}&task=motion-annotate&taskMode=fixup&startFrom=latest`,
  part_image_path: `${Constants.baseURL}/thumbnails/parts/{source}/articulations/part_renders/{modelID}/{partIndex}.png`,
  object_image_path: `${Constants.baseURL}/thumbnails/parts/{source}/renders/{modelID}/{modelID}.png`,
  articulation_inspector_path: `${Constants.baseURL}/articulation-inspector?moving-part-ids={this.partIdList}`
};

function thumbnailForObject(object) {
  const [source, modelID] = object.full_id.split('.');
  let thumbnail = '';
  switch (source) {
    case 'p5d':
      thumbnail = assetPaths.object_screenshot_path;
      break;
    case 'shape2motion':
    case 'rpmnet':
    case 'partnetsim':
      thumbnail = assetPaths.object_image_path;
      break;
    default:
      thumbnail = '';
  }
  return thumbnail.replace(/{modelID}/g, modelID).replace(/{source}/g, source);
}

function thumbnailForPartAndObjectInformation(partAndObjectInformation) {
  const [source, modelID] = partAndObjectInformation.full_id.split('.');
  let thumbnail = '';
  switch (source) {
    case 'p5d':
      thumbnail = assetPaths.object_screenshot_path;
      break;
    case 'shape2motion':
    case 'rpmnet':
    case 'partnetsim':
      thumbnail = assetPaths.part_image_path;
      break;
    default:
      thumbnail = '';
  }
  return thumbnail
    .replace(/{modelID}/g, modelID)
    .replace(/{source}/g, source)
    .replace(/{partIndex}/g, partAndObjectInformation.part.part_index);
}

function thumbnailForJoint(objectID, movingPartIndex, basePartIndex) {
  return `http://aspis.cmpt.sfu.ca/datasets/partnetsim/articulations/render_joints/${objectID}/${objectID}-${movingPartIndex}-${basePartIndex}.png`;
}

export {
  thumbnailForObject,
  thumbnailForPartAndObjectInformation,
  thumbnailForJoint
};
