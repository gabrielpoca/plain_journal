import uuidv1 from "uuid/v1";
import Dexie from "dexie";
import FakeIndexedDB from "fake-indexeddb";
import FDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import "dexie-observable";

let db = new Dexie("journalApp", {});

if (process.env.NODE_ENV === "test") {
  db = new Dexie("journalApp", {
    indexedDB: FakeIndexedDB,
    IDBKeyRange: FDBKeyRange
  });
}

db.version(1).stores({
  entries: "id,date,dirty,deleted",
  settings: "id"
});

export default db;

(async function() {
  if (localStorage.getItem("toJournalApp") === "true") return;

  const oldDB = new Dexie("journal");

  oldDB.version(1).stores({
    entries: "++id,date",
    settings: "id"
  });

  oldDB.version(2).stores({});

  const entries = await oldDB.entries.toArray();

  entries.map(e =>
    db.entries.put({ ...e, id: uuidv1(), deleted: "false", dirty: "true" })
  );

  oldDB.delete();

  localStorage.setItem("toJournalApp", "true");
})();
