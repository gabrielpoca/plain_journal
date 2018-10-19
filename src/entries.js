import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';
import QuickSearch from 'pouchdb-quick-search';

PouchDB.plugin(QuickSearch);
PouchDB.plugin(Find);

const entries = new PouchDB('entries');

entries.createIndex({
  index: { fields: ['date'] }
});

entries.search({
  fields: ['body'],
  build: true
});

window.db = entries;

export default entries;
