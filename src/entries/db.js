import moment from "moment";
import uuidv1 from "uuid/v1";

import db from "../core/DB";
import EventEmitter from "../core/EventEmitter";

import { decrypt, encrypt } from "../core/Session/KeyPair";

const emitter = new EventEmitter();

db.on("changes", changes => {
  const entriesChanges = changes.filter(({ table }) => table === "entries");

  if (entriesChanges.length > 0) {
    const changeEvent = new CustomEvent("changed", {
      detail: {}
    });
    return emitter.dispatchEvent(changeEvent);
  }
});

export const onChange = cb => emitter.addEventListener("changed", cb);
export const offChange = cb => emitter.removeEventListener("changed", cb);

export const all = async () => {
  const entries = await db.entries
    .where("deleted")
    .equals("false")
    .reverse()
    .sortBy("date");

  console.log(await db.entries.toArray());

  return entries;
};

export const get = async id => {
  return await db.entries.get(id);
};

export const remove = async doc => {
  return db.entries.put({ ...doc, dirty: "true", deleted: "true" });
};

export const put = async changes => {
  if (changes.date instanceof Date)
    changes.date = moment(changes.date).format("YYYY-MM-DD");

  if (!changes.id) changes.id = uuidv1();
  changes.dirty = "true";
  changes.deleted = "false";
  return db.entries.put(changes);
};

export const encryptAll = async () => {
  return Promise.all(
    (await db.entries.toArray())
      .filter(doc => !doc.encrypted)
      .map(async doc => {
        const encrypted = await encrypt(doc.body);
        return await db.entries.put({
          ...doc,
          body: encrypted,
          encrypted: true
        });
      })
  );
};

export const decryptAll = async () => {
  return Promise.all(
    (await db.entries.toArray())
      .filter(doc => doc.encrypted)
      .map(async doc => {
        const decrypted = await decrypt(doc.body);
        return await db.entries.put({
          ...doc,
          body: decrypted,
          encrypted: false
        });
      })
  );
};
