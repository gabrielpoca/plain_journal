import Dexie from "dexie";
import "dexie-observable";

const db = new Dexie("journal");

db.version(1).stores({
  entries: "++id,date",
  settings: "id"
});

db.version(2).stores({});

export default db;
