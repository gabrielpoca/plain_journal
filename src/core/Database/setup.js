import RxDB from "rxdb";
import PouchDBIDB from "pouchdb-adapter-idb";
import PouchDBHTTP from "pouchdb-adapter-http";

import * as Entries from "./Entries";
import * as Settings from "./Settings";

RxDB.plugin(PouchDBIDB);
RxDB.plugin(PouchDBHTTP);

export default async password => {
  const db = await RxDB.create({
    name: "journal",
    adapter: "idb",
    password
  });

  await Settings.setup(db);
  await Entries.setup(db);

  window.db = db;

  return db;
};
