import localForage from "localforage";

class CurrentUser {
  constructor() {
    this.load();
  }

  async set(user) {
    this.user = user;
    localForage.setItem("currentUser", user);
  }

  async unset() {
    this.user = null;
    localForage.setItem("currentUser", false);
  }

  async load() {
    this.user = await localForage.getItem("currentUser");
  }
}

export default new CurrentUser();
