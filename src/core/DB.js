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
