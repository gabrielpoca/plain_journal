import PouchDB from 'pouchdb';
import Find from 'pouchdb-find';
import Authentication from 'pouchdb-authentication';

PouchDB.plugin(Authentication);
PouchDB.plugin(Find);

const db = new PouchDB('db');

(async () => {
  try {
    if (localStorage.getItem('removeHabits') === 'true') return;
    const habits = await db.find({ selector: { doc_type: 'habit' } });
    if (habits.docs) await Promise.all(habits.docs.map(doc => db.remove(doc)));
    localStorage.setItem('removeHabits', 'true');
  } catch (e) {
    console.error(e);
  }

  await db.createIndex({
    index: {
      fields: ['doc_type'],
    },
  });
})();

window.db = db;

export default db;
