import _ from 'lodash';
import moment from 'moment';
import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';
import QuickSearch from 'pouchdb-quick-search';

import db from '../db';

PouchDB.plugin(QuickSearch);
PouchDB.plugin(Find);

const entries = new PouchDB('entries');

if (localStorage.getItem('dbMigrated') !== 'true') {
  (async () => {
    console.log('Migrating database');

    entries.search({
      fields: ['body'],
      destroy: true,
    });

    const rows = (await entries.allDocs({
      include_docs: true,
      attachments: true,
    })).rows;

    const res = rows
      .map(doc => doc.doc)
      .filter(doc => !!doc.body && !!doc.date)
      .map(doc => {
        const change = {
          _id: `journal_${moment(doc.date).format('DD-MM-YYYY')}_${doc._id}`,
          date: doc.date,
          body: doc.body,
          doc_type: 'journal',
        };

        if (_.get(doc, '_attachments.cover', false)) {
          change._attachments = {
            cover: {
              content_type: doc._attachments.cover.content_type,
              data: doc._attachments.cover.data,
            },
          };
        }

        return change;
      })
      .map(change => db.put(change));

    await Promise.all(res);

    localStorage.setItem('dbMigrated', 'true');
  })();
}

export default entries;
