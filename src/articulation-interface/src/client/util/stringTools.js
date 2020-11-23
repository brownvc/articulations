/* eslint-disable import/prefer-default-export */

const capitalize = (str) => {
  if (str === undefined) {
    return undefined;
  }
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

export {
  capitalize
};
