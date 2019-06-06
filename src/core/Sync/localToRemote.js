import uuidv1 from "uuid/v1";
import _ from "lodash";

import DB from "../DB";
import { decrypt, encrypt } from "../Session/KeyPair";

const ALLOWED_REMOTE_FIELDS = ["_id", "_rev", "date", "body", "deleted"];

export default async remoteDB => {
  try {
    const entries = await DB.entries.where({ dirty: "true" }).toArray();

    await Promise.all(entries.map(entry => updateEntry(remoteDB, entry)));
  } catch (e) {
    console.error("status code", e.statusCode);
    console.error(e.message);
  }
};

export async function updateEntry(remoteDB, entry) {
  try {
    if (entry.deleted === "true") {
      return await onLocalEntryDeleted(remoteDB, entry);
    }

    return await updateRemoteEntry(remoteDB, entry);
  } catch (e) {
    if (e.statusCode === 409) {
      try {
        await onRemoteUpdateChanged(remoteDB, entry);
      } catch (e) {
        // it was deleted in the server
        if (e.statusCode === 404) {
          return await onRemoteEntryDeleted(entry);
        } else {
          throw new Error(e);
        }
      }
    } else {
      throw new Error(e);
    }
  }
}

export async function updateRemoteEntry(remoteDB, entry) {
  const parsedEntry = _.pick(entry, ALLOWED_REMOTE_FIELDS);
  parsedEntry.body = await encrypt(parsedEntry.body);

  const response = await remoteDB.insert(parsedEntry, entry.id);

  if (response.ok) {
    return await DB.entries.update(entry.id, {
      _rev: response.rev,
      dirty: "false"
    });
  } else {
    throw new Error(response);
  }
}

export async function onLocalEntryDeleted(remoteDB, entry) {
  try {
    if (entry._rev) await remoteDB.destroy(entry.id, entry._rev);
  } catch (e) {
    if (e.statusCode === 404) {
      console.warn(`Document ${entry.id} already deleted`);
    } else {
      throw new Error(e);
    }
  }

  return await DB.entries.delete(entry.id);
}

export async function onRemoteUpdateChanged(remoteDB, entry) {
  const localEntry = _.omit(entry, "_rev");
  localEntry.dirty = "true";

  const remoteEntry = await remoteDB.get(entry.id + "");
  remoteEntry.body = await decrypt(remoteEntry.body);

  return await DB.transaction("rw", DB.entries, async () => {
    await DB.entries.update(entry.id, remoteEntry);
    return await DB.entries.put({ ...localEntry, id: uuidv1() });
  });
}

export async function onRemoteEntryDeleted(entry) {
  if (entry.dirty === "true") {
    const localEntry = _.omit(entry, "_rev");
    await DB.transaction("rw", DB.entries, async () => {
      await DB.entries.put({ ...localEntry, id: uuidv1() });
      return await DB.entries.delete(entry.id);
    });
  }

  return await DB.entries.delete(entry.id);
}
