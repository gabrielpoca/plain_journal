import PouchDB from "pouchdb";
import { combineLatest } from "rxjs";
import { filter } from "rxjs/operators";

import { user$ } from "../User";
import { remoteDB$ } from "./setup";

let synced = false;

const $sync = combineLatest(user$, remoteDB$).pipe(
  filter(([{ user }, db]) => user && db)
);

$sync.subscribe(([user, db]) => {
  if (synced) return console.error("sync already setup");
  sync(db, user);
  synced = true;
});

const asciiToHex = str => {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
};

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5984"
    : "https://couch.gabrielpoca.com";

const sync = async (db, { user }) => {
  const dbName = `${baseURL}/userdb-${asciiToHex(user.name)}`;

  const remoteDB = new PouchDB(dbName, {
    skipSetup: true,
    fetch: function(url, opts) {
      opts.headers.set("X-Auth-CouchDB-UserName", user.name);
      opts.headers.set("X-Auth-CouchDB-Token", user.token);
      return PouchDB.fetch(url, opts);
    }
  });

  try {
    let journalView = {};

    try {
      journalView = (await remoteDB.get("_design/journal")) || {};
    } catch (_e) {}

    await remoteDB.put({
      ...journalView,
      _id: "_design/journal",
      views: {
        journal: {
          map: `function(doc) {
            if (doc._id === "_design/journal" || doc.modelType === "journalEntry") emit(doc);
          }`
        }
      }
    });

    let settingsView = {};

    try {
      settingsView = (await remoteDB.get("_design/settings")) || {};
    } catch (_e) {}

    await remoteDB.put({
      ...settingsView,
      _id: "_design/settings",
      views: {
        settings: {
          map: `function(doc) {
            if (doc._id === "_design/settings" || doc.modelType === "setting") emit(doc);
          }`
        }
      }
    });

    let pushNotificationsView = {};

    try {
      pushNotificationsView =
        (await remoteDB.get("_design/push_notifications")) || {};
    } catch (_e) {}

    await remoteDB.put({
      ...pushNotificationsView,
      _id: "_design/push_notifications",
      views: {
        push_notifications: {
          map: `function(doc) {
            if (doc._id === "_design/push_notifications" || doc.modelType === "pushNotifications") emit(doc);
          }`
        }
      }
    });
  } catch (e) {
    console.error(e);
  }

  await db.settings.sync({
    remote: remoteDB,
    options: {
      filter: "_view",
      view: "settings",
      live: true,
      retry: true
    }
  });

  await db.entries.sync({
    remote: remoteDB,
    options: {
      filter: "_view",
      view: "journal",
      live: true,
      retry: true
    }
  });

  await db.push_notifications.sync({
    remote: remoteDB,
    options: {
      filter: "_view",
      view: "push_notifications",
      live: true,
      retry: true
    }
  });
};
