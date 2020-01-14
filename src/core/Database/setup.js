import RxDB from "rxdb";
import PouchDBIDB from "pouchdb-adapter-idb";
import PouchDBHTTP from "pouchdb-adapter-http";
import { BehaviorSubject } from "rxjs";

import { user$ } from "../User";

import { LocalDatabase } from "./LocalDatabase";
import { SyncDatabase } from "./SyncDatabase";

window.RxDB = RxDB;

RxDB.plugin(PouchDBIDB);
RxDB.plugin(PouchDBHTTP);

export const db$ = new BehaviorSubject();

let localDB;
let syncDB;

user$.subscribe({
  next: ({ user, loading }) => {
    if (loading) return;

    setup(user);
  }
});

export const setup = async user => {
  if (!localDB) {
    localDB = new LocalDatabase();
    await localDB.init();
  }

  if (!user) {
    if (syncDB) {
      await syncDB.destroy();
      syncDB = null;
    } else {
      SyncDatabase.remove();
    }

    db$.next(localDB.db);
  } else if (user && !syncDB) {
    syncDB = new SyncDatabase();
    await syncDB.init(user.name, user.password, user.token);
    db$.next(syncDB.db);

    if (localStorage.getItem("localToRemote") !== "true") {
      const db = localDB;
      localDB = null;
      await db.copyTo(syncDB.db);
      await db.destroy();
      localStorage.setItem("localToRemote", "true");
    }

    LocalDatabase.remove();
  }
};

export function clearLocalDBToSyncDB() {
  localStorage.setItem("localToRemote", "false");
}
