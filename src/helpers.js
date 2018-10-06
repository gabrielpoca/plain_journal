import * as blobUtil from 'blob-util';

import placeholder from './placeholder-image.jpg';

const cache = {};

export const getCoverFromEntry = entry => {
  if (cache[entry._id]) return cache[entry._id];
  if (!entry.cover && !entry._attachments.cover.data) return placeholder;

  if (entry.cover) {
    const url = URL.createObjectURL(entry.cover);
    cache[entry._id] = url;
    return url;
  } else if (entry._attachments.cover.data) {
    const cover = blobUtil.base64StringToBlob(entry._attachments.cover.data);
    const url = URL.createObjectURL(cover);
    cache[entry._id] = url;
    return url;
  }
};
