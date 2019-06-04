import Dexie from "dexie";
import "dexie-observable";

const db = new Dexie("journal");

db.version(1).stores({
  entries: "id,date,dirty,deleted",
  settings: "id"
});

db.open();

export default db;
