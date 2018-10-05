import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';

PouchDB.plugin(Find);

const entries = new PouchDB('entries');

entries.createIndex({
  index: { fields: ['date'] }
});

window.db = entries;

export default entries;
