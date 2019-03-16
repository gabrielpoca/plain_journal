import _ from "lodash";

import Session from "./Session";
import db from "./DB";

const run = async () => {
  try {
    if (!(await Session.valid)) return;

    console.log("here");
    const keyPair = Session.keyPair;
    const api = Session.api;

    const entries = await db.entries.toArray();
    const have = entries.reduce((memo, entry) => {
      memo[entry.id] = entry.version;
      return memo;
    }, {});

    const { data } = await api.handshake({ have });

    const { have: serverHave, missing } = data;

    console.log("running", have, data, serverHave);
    if (serverHave.length > 0)
      await db.entries.bulkPut(
        serverHave.map(e => ({
          ...e,
          body: keyPair.decrypt(e.body),
          id: e.internal_id
        }))
      );

    if (missing.length === 0) return;

    const toReturnEntries = await Promise.all(
      (await Promise.all(missing.map(id => db.entries.get(id)))).map(
        async entry => ({
          ..._.omit(entry, "cover"),
          internal_id: entry.id,
          body: await keyPair.encrypt(entry.body)
        })
      )
    );

    console.log(toReturnEntries);

    await api.update({ have: toReturnEntries });
  } catch (e) {
    console.error(e.message);
  }
};

setInterval(run, 1000 * 120); // every minute

if (Session.token) run();
Session.onChange(run);

window.sync = run;
