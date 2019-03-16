import moment from "moment";
import _ from "lodash";

import pouchdb from "../db";
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
  const entries = await db.entries.toArray();
  return _.chain(entries)
    .map(entry => ({ ...entry, date: moment(entry.date, "YYYY-MM-DD") }))
    .sortBy("date")
    .value();
};

export const get = async id => {
  return await db.entries.get(parseInt(id, 10));
};

export const remove = async doc => {
  return db.entries.delete(doc.id);
};

export const put = async changes => {
  if (changes.date instanceof Date)
    changes.date = moment(changes.date).format("YYYY-MM-DD");

  changes.version = (changes.version || 0) + 1;
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
          encrypted: true,
          version: doc.version + 1
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
          encrypted: false,
          version: doc.version + 1
        });
      })
  );
};

(async () => {
  try {
    if (localStorage.getItem("toDexie") === "true") return;

    var entries = await pouchdb.allDocs({
      include_docs: true,
      attachments: true
    });

    await db.entries.bulkAdd(
      await Promise.all(
        entries.rows
          .filter(d => d.doc.doc_type === "journal")
          .map(async e => {
            return {
              body: e.doc.encrypted ? await decrypt(e.doc.body) : e.doc.body,
              date: e.doc.date,
              cover: _.get(e.doc, "_attachments.cover")
            };
          })
      )
    );

    localStorage.setItem("toDexie", "true");
  } catch (e) {
    console.error(e);
  }
})();
