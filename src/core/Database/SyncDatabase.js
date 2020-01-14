import RxDB from "rxdb";
import { BehaviorSubject } from "rxjs";

import { startSync, cancelSync } from "./sync";
import * as Entries from "./Entries";
import * as Settings from "./Settings";
import * as PushNotificatios from "./PushNotificatios";

export class SyncDatabase {
  constructor() {
    this.$ = new BehaviorSubject();
  }

  async init(name, password, token) {
    this.db = await RxDB.create({
      name: "journal",
      adapter: "idb",
      password: password
    });

    await Entries.setup(this.db, true);
    await Settings.setup(this.db);
    await PushNotificatios.setup(this.db);

    await startSync(this.db, { name, token });

    return this.$.next(this);
  }

  async destroy() {
    await cancelSync();
    await this.db.remove();
    return this.db.destroy();
  }
}

SyncDatabase.remove = function() {
  RxDB.removeDatabase("journal", "idb");
};
