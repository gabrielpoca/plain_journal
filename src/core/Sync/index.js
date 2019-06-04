import Nano from "nano";

import Session from "../Session";

import remoteToLocal from "./remoteToLocal";
import localToRemote from "./localToRemote";

const asciiToHex = str => {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
};

const run = async () => {
  try {
    if (Session.loading) return;

    const currentUser = Session.currentUser;

    if (!currentUser) return;

    const nano = Nano({
      url: "http://localhost:5984",
      defaultHeaders: {
        "X-Auth-CouchDB-UserName": currentUser.email,
        "X-Auth-CouchDB-Token": currentUser.couch_token
      }
    });

    const userDB = nano.use(`userdb-${asciiToHex(currentUser.email)}`);

    await remoteToLocal(userDB);
    await localToRemote(userDB);
  } catch (e) {
    console.error(e);
  }
};

setInterval(run, 1000 * 120); // every minute
setTimeout(run, 2000);
run();
//Session.onChange(run);

window.sync = run;
