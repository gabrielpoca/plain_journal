import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';

PouchDB.plugin(Find);

const db = new PouchDB('db');

(async () => {
  db.createIndex({
    index: {
      fields: ['doc_type'],
    },
  });
})();

window.db = db;

export default db;
