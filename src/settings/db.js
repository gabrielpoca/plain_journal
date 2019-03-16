import db from '../core/DB';
import EventEmitter from '../core/EventEmitter';

const emitter = new EventEmitter();

export const onChange = cb => emitter.addEventListener('changed', cb);
export const off = cb => emitter.removeEventListener('changed', cb);

export const put = async changes => {
  await db.settings.put(changes);
  const changeEvent = new CustomEvent('changed', {
    detail: {},
  });
  return emitter.dispatchEvent(changeEvent);
};

export const get = async id => {
  return db.settings.get(id);
};

export const all = () => db.settings.toArray();
