export default function filterJoints(objects, filters, collections, selection = undefined) {
  // Extracts the relevant filters.
  const { partLabel, objectCategory, dataSource } = filters;

  // If a collection is specified, finds the valid object full IDs for that collection.
  const objectsInCollection = new Set();
  const partsInCollection = new Set();
  if (filters.collection && collections) {
    let targetCollections = collections;
    if (filters.collection !== 'Any Collection' && filters.collection !== 'No Collection') {
      targetCollections = collections.filter(c => c.name === filters.collection);
    }
    targetCollections.forEach((collection) => {
      collection.joints.forEach((joint) => {
        objectsInCollection.add(joint.full_id);
        partsInCollection.add(joint.moving_part_id);
        partsInCollection.add(joint.base_part_id);
      });
    });
  }

  // Removes the filtered joints.
  const filteredObjects = [];
  objects.forEach((object) => {
    // Filters out the data sources.
    if (dataSource && object.source !== dataSource) {
      return;
    }

    // Skips the object if it's filtered out because of the collection filter.
    if (filters.collection && collections) {
      if (filters.collection === 'No Collection') {
        // An object is filtered out if all of its parts are associated with joints.
        const allPartsInJoints = object.parts.every(part => partsInCollection.has(part.part_id));
        if (allPartsInJoints) {
          return;
        }
      } else if (!objectsInCollection.has(object.full_id)) {
        // An object is filtered out if none of its parts are in:
        // - any collection (for 'Any Collection')
        // - the specified collection (for a collection)
        return;
      }
    }

    // Skips the object if it's filtered out.
    if (objectCategory && !object.category.includes(objectCategory)) {
      return;
    }

    // Skips the object if it's not part of the selection.
    if (selection && selection.selectionType === 'Object' && selection.selection !== object.objectID) {
      return;
    }
    if (selection && selection.selectionType === 'Object Category' && !object.category.includes(selection.selection)) {
      return;
    }

    // Adds the unmodified object if no part filter is set.
    if (partLabel === undefined && selection === undefined) {
      filteredObjects.push(object);
      return;
    }

    // If a part label is specified, filters out parts not matching the part label.
    const filteredObject = {
      source: object.source,
      full_id: object.full_id,
      category: object.category,
      objectID: object.objectID,
      parts: object.parts.filter((part) => {
        // Skips the part if it's not part of the selection.
        if (selection && selection.selectionType === 'Part Label' && part.part_label !== selection.selection) {
          return false;
        }

        // Filters the part.
        return part.part_label === partLabel || partLabel === undefined;
      }),
    };
    if (filteredObject.parts.length > 0) {
      filteredObjects.push(filteredObject);
    }
  });

  return filteredObjects;
}
