import Dexie from "dexie";
import "dexie-observable";

const db = new Dexie("journalApp");

db.version(1).stores({
  entries: "id,date,dirty,deleted",
  settings: "id"
});

export default db;
