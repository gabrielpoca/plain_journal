import * as blobUtil from 'blob-util';

const cache = {};

export const getCoverFromEntry = entry => {
  if (cache[entry._id]) return cache[entry._id];

  const blob = blobUtil.base64StringToBlob(entry._attachments.cover.data);
  const url = URL.createObjectURL(blob);
  cache[entry._id] = url;
  return url;
};
