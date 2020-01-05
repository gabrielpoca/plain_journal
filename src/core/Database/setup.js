import RxDB from "rxdb";
import PouchDBIDB from "pouchdb-adapter-idb";
import PouchDBHTTP from "pouchdb-adapter-http";
import { BehaviorSubject } from "rxjs";

import { user$ } from "../User";
import * as Entries from "./Entries";
import * as Settings from "./Settings";
import * as PushNotificatios from "./PushNotificatios";

RxDB.plugin(PouchDBIDB);
RxDB.plugin(PouchDBHTTP);

export const db$ = new BehaviorSubject();
export const remoteDB$ = new BehaviorSubject();

let localDB;
let syncDB;
let creatingLocalDBs = false;

user$.subscribe({
  next: ({ user, loading }) => {
    if (loading) return;

    if (!localStorage.getItem("enc_key") && user && user.password) {
      localStorage.setItem("enc_key", user.password);
    }

    setup();
  }
});

export const setup = async () => {
  const password = localStorage.getItem("enc_key");

  if (password && syncDB) return;
  if (!password && localDB) return;

  try {
    const db = await RxDB.create({
      name: password ? "journal" : "local_journal",
      adapter: "idb",
      password: password || undefined
    });

    await Entries.setup(db, !!password);
    await Settings.setup(db);
    await PushNotificatios.setup(db);

    if (password) {
      syncDB = db;
      remoteDB$.next(db);

      if (localStorage.getItem("localToRemote") !== "true") {
        if (!localDB && !creatingLocalDBs) {
          creatingLocalDBs = true;
          try {
            localDB = await RxDB.create({
              name: "local_journal",
              adapter: "idb"
            });

            await Settings.setup(localDB);
            await PushNotificatios.setup(localDB);
            await Entries.setup(localDB);
          } catch (e) {
            creatingLocalDBs = false;
            console.error(e);
          }
        }

        localDB.settings.sync({
          remote: db.settings,
          direction: {
            push: true,
            pull: false
          }
        });

        localDB.push_notifications.sync({
          remote: db.push_notifications,
          direction: {
            push: true,
            pull: false
          }
        });

        const localEntries = await localDB.entries.find().exec();

        localEntries.forEach(doc => {
          const { body, id, date, latitude, longitude } = doc;
          db.entries.insert({
            id,
            date,
            body,
            latitude,
            longitude
          });
        });

        localStorage.setItem("localToRemote", "true");
      }
    } else {
      localDB = db;
    }

    db$.next(db);

    window.db = db;
  } catch (e) {
    console.error(e);
  }
};
