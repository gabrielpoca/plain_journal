import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

import * as EncryptionKey from './EncryptionKey';
import db from '../db';

PouchDB.plugin(PouchDBAuthentication);

class Authentication {
  constructor() {
    this.username = localStorage.getItem('username');

    if (this.username) {
      this.setupRemoteDB();
      this.enableRemoteSync();
    }
  }

  async configure(username, password) {
    if (this.username) await this.disable();

    await EncryptionKey.setup(username, password);

    this.username = username;
    this.setupRemoteDB();
    let loggedIn = false;

    try {
      loggedIn = await this.remoteDB.logIn(username, password);
    } catch (error) {
      console.error(error);
    }

    if (!loggedIn) {
      try {
        loggedIn = await this.remoteDB.signUp(username, password);
      } catch (error) {
        console.error(error);
      }
    }

    if (loggedIn) {
      this.enableRemoteSync();
      localStorage.setItem('username', username);
    } else {
      this.disable();
    }
  }

  async disable() {
    this.sync && (await this.sync.cancel());
    this.username = null;
    await EncryptionKey.destroy();
    localStorage.setItem('username', null);
  }

  setupRemoteDB() {
    this.remoteDB = new PouchDB(
      `https://couch.gabrielpoca.com/userdb-${new Buffer(
        this.username
      ).toString('hex')}`,
      {
        fetch: (url, opts) => {
          opts.credentials = 'include';
          return PouchDB.fetch(url, opts);
        },
      }
    );
  }

  enableRemoteSync() {
    console.log('enable');
    this.sync = db
      .sync(this.remoteDB, { live: true })
      .on('error', console.error)
      .on('compelte', console.log);
  }
}

export default new Authentication();
