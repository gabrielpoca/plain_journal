import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';

PouchDB.plugin(Find);

const db = new PouchDB('db');

window.db = db;

export default db;
