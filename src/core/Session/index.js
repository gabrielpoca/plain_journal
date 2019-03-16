import EventEmitter from "../EventEmitter";
import * as API from "./api";
import * as KeyPair from "./KeyPair";

class Session {
  constructor() {
    this.loaded = false;
    this.emitter = new EventEmitter();
    this.loadUser();
  }

  get keyPair() {
    return KeyPair;
  }

  get api() {
    return API;
  }

  valid() {
    return (
      localStorage.getItem("usertoken") !== null &&
      localStorage.getItem("usertoken") !== "null"
    );
  }

  async loadUser() {
    try {
      this._loadUserToken();
      if (this.valid()) {
        const { data } = await API.currentUser();
        if (data.id) this._sendChanged();
      }
      this.loaded = true;
    } catch (e) {
      this.loaded = true;
      console.error(e);
    }
  }

  async signIn(email, password) {
    const { data } = await API.signIn({
      session: { email, password }
    });

    await KeyPair.setup(email, password);
    this._setUserToken(data.token);
    this._sendChanged();
  }

  async signUp(email, password) {
    const { data } = await API.signUp({
      user: { email, password }
    });

    await KeyPair.setup(email, password);
    this._setUserToken(data.token);
    this._sendChanged();
  }

  async signOut() {
    await KeyPair.destroy();
    this._setUserToken(null);
    this._sendChanged();
  }

  onChange(cb) {
    this.emitter.addEventListener("changed", cb);
  }

  off(cb) {
    this.emitter.removeEventListener("changed", cb);
  }

  _setUserToken(token) {
    localStorage.setItem("usertoken", token);
    API.setAuthToken(token);
  }

  _loadUserToken() {
    const token = localStorage.getItem("usertoken");
    API.setAuthToken(token);
  }

  _sendChanged() {
    const changeEvent = new CustomEvent("changed", {
      detail: {}
    });
    this.emitter.dispatchEvent(changeEvent);
  }
}

export default new Session();
