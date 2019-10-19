import RxDB from "rxdb";
import PouchDBIDB from "pouchdb-adapter-idb";
import PouchDBHTTP from "pouchdb-adapter-http";
import { BehaviorSubject } from "rxjs";

import * as Entries from "./Entries";
import * as Settings from "./Settings";

RxDB.plugin(PouchDBIDB);
RxDB.plugin(PouchDBHTTP);

export const db$ = new BehaviorSubject();

export const setup = async password => {
  const db = await RxDB.create({
    name: "journal",
    adapter: "idb",
    password
  });

  await Settings.setup(db);
  await Entries.setup(db);

  db$.next(db);

  window.db = db;

  return db;
};
