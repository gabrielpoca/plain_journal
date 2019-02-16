import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';
import Authentication from 'pouchdb-authentication';

PouchDB.plugin(Authentication);
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
