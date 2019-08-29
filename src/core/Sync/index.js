import Nano from "nano";

import Session from "../Session";

//import * as entriesDB from "../../entries/db";
import remoteToLocal from "./remoteToLocal";
import localToRemote from "./localToRemote";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5984"
    : "https://couch.gabrielpoca.com";

const asciiToHex = str => {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
};

const getRemoteDB = currentUser => {
  const nano = Nano({
    url: baseURL,
    defaultHeaders: {
      "X-Auth-CouchDB-UserName": currentUser.email,
      "X-Auth-CouchDB-Token": currentUser.couch_token
    }
  });

  return nano.use(`userdb-${asciiToHex(currentUser.email)}`);
};

const runLocalToRemote = async () => {
  try {
    if (Session.loading) return;
    const currentUser = Session.currentUser;
    if (!currentUser) return;

    await localToRemote(getRemoteDB(currentUser));
  } catch (e) {
    console.error(e);
  }
};

const runRemoteToLocal = async () => {
  try {
    if (Session.loading) return;
    const currentUser = Session.currentUser;
    if (!currentUser) return;

    await remoteToLocal(getRemoteDB(currentUser));
  } catch (e) {
    console.error(e);
  }
};

//Session.onChange(runLocalToRemote);
//Session.onChange(runRemoteToLocal);
//entriesDB.onChange(runLocalToRemote);

//setInterval(runRemoteToLocal, 1000 * 60); // every minute
//setTimeout(runRemoteToLocal, 100);
//setTimeout(runLocalToRemote, 100);
