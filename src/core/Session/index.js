import EventEmitter from "../EventEmitter";
import * as API from "./api";
import * as KeyPair from "./KeyPair";
import CurrentUser from "./CurrentUser";

const emitter = new EventEmitter();

class Session {
  constructor() {
    this.loading = true;
  }

  get currentUser() {
    return CurrentUser.user;
  }

  async load() {
    await CurrentUser.load();
    if (CurrentUser.user) API.setAuthToken(CurrentUser.user.token);
    this.loading = false;
    this._sendChanged();
  }

  signIn = async (email, password) => {
    if (this.loading) throw new Error("Session not loaded");
    if (CurrentUser.user) throw new Error("Already signed in");

    try {
      const { data } = await API.signIn({
        session: { email, password }
      });

      await CurrentUser.set(data);
      await KeyPair.set(email, password);
      API.setAuthToken(data.token);
      this._sendChanged();
    } catch (error) {
      await this._unsetEverything();
      console.error(error);
      throw error;
    }
  };

  signUp = async (email, password) => {
    if (this.loading) throw new Error("Session not loaded");
    if (CurrentUser.user) throw new Error("Already signed in");

    try {
      const { data } = await API.signUp({
        user: { email, password }
      });

      await CurrentUser.set(data);
      await KeyPair.set(email, password);
      API.setAuthToken(data.token);
      this._sendChanged();
    } catch (error) {
      await this._unsetEverything();
      console.error(error);
      throw error;
    }
  };

  signOut = async () => {
    if (this.loading) throw new Error("Session not loaded");
    if (!CurrentUser.user) throw new Error("Not signed in");

    await this._unsetEverything();
    this._sendChanged();
  };

  onChange(cb) {
    emitter.addEventListener("changed", cb);
  }

  off(cb) {
    emitter.removeEventListener("changed", cb);
  }

  async _unsetEverything() {
    await KeyPair.unset();
    await CurrentUser.unset();
    API.setAuthToken(null);
  }

  _sendChanged() {
    const changeEvent = new CustomEvent("changed", {
      detail: {}
    });
    emitter.dispatchEvent(changeEvent);
  }
}

export default new Session();
