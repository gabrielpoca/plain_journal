import RxDB from "rxdb";
import { BehaviorSubject } from "rxjs";

import * as Entries from "./Entries";
import * as Settings from "./Settings";
import * as PushNotificatios from "./PushNotificatios";

export class LocalDatabase {
  constructor() {
    this.$ = new BehaviorSubject();
  }

  async init() {
    this.db = await RxDB.create({
      name: "local_journal",
      adapter: "idb"
    });

    await Entries.setup(this.db, false);
    await Settings.setup(this.db);
    await PushNotificatios.setup(this.db);

    this.$.next(this);
  }

  async destroy() {
    await this.db.destroy();
    return this.db.remove();
  }

  async copyTo(db) {
    await this.db.settings.sync({
      remote: db.settings,
      direction: {
        push: true,
        pull: false
      }
    });

    await this.db.push_notifications.sync({
      remote: db.push_notifications,
      direction: {
        push: true,
        pull: false
      }
    });

    const localEntries = await this.db.entries.find().exec();

    return await Promise.all(
      localEntries.map(async doc => {
        const { body, id, date, latitude, longitude } = doc;
        try {
          await db.entries.insert({
            id,
            date,
            body,
            latitude,
            longitude
          });
        } catch (e) {
          console.error(e);
        }
      })
    );
  }
}

LocalDatabase.remove = function() {
  RxDB.removeDatabase("local_journal", "idb");
};
