import placeholder from './placeholder-image.jpg';

const cache = {};

export const getCoverFromEntry = entry => {
  if (cache[entry._id]) return cache[entry._id];
  if (!entry.cover) return placeholder;

  const url = URL.createObjectURL(entry.cover);
  cache[entry._id] = url;
  return url;
};
