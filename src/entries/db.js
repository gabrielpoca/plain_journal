import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';
import QuickSearch from 'pouchdb-quick-search';
import Lunr from 'lunr';

/* eslint-disable */
global.lunr = Lunr;
require('lunr-languages/lunr.multi')(Lunr);
require('lunr-languages/lunr.stemmer.support')(Lunr);
require('lunr-languages/lunr.pt')(Lunr);
/* eslint-enable */

PouchDB.plugin(QuickSearch);
PouchDB.plugin(Find);

const entries = new PouchDB('entries');

entries.createIndex({
  index: { fields: ['date'] }
});

entries.search({
  fields: ['body'],
  build: true,
  language: ['pt', 'en']
});

window.db = entries;

export default entries;
