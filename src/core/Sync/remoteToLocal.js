import uuidv1 from "uuid/v1";
import localForage from "localforage";
import _ from "lodash";

import DB from "../DB";
import { decrypt } from "../Session/KeyPair";

export default async userDB => {
  const localLastSeq = (await localForage.getItem("last_seq")) || 0;

  const { results, last_seq } = await userDB.changes({
    include_docs: true,
    since: localLastSeq
  });

  await Promise.all(
    results.map(e => (e.deleted ? onRemoteEntryDeleted(e) : onRemoteEntry(e)))
  );

  return await localForage.setItem("last_seq", last_seq);
};

async function onRemoteEntry(rawEntry) {
  const entry = normalizeEntry(rawEntry);
  const localEntry = await getLocalEntry(entry.id);

  entry.body = await decrypt(entry.body);

  if (!localEntry) {
    return await DB.entries.put(entry);
  }

  if (entry._rev === localEntry._rev) {
    return true;
  } else {
    if (localEntry.dirty === "true") {
      return await DB.transaction("rw", DB.entries, async () => {
        const newEntry = _.omit(localEntry, "_rev", "id");
        await DB.entries.put({ ...newEntry, id: uuidv1() });
        return await DB.entries.update(entry.id, entry);
      });
    } else {
      return await DB.entries.update(entry.id, entry);
    }
  }
}

async function onRemoteEntryDeleted(entry) {
  const localEntry = await getLocalEntry(entry.id);

  if (!localEntry) return true;
  else if (localEntry.dirty !== "true")
    return await DB.entries.delete(localEntry.id);
  else {
    const newEntry = _.omit(localEntry, "_rev", "id");

    await DB.transaction("rw", DB.entries, async () => {
      await DB.entries.put({ ...newEntry, id: uuidv1() });
      return await DB.entries.delete(entry.id);
    });
  }
}

async function getLocalEntry(id) {
  let entry = null;

  try {
    entry = await DB.entries.get(id);
  } catch (e) {
    if (e.statusCode !== 404) {
      throw e;
    }
  }

  return entry;
}

function normalizeEntry(entry) {
  if (entry.doc) {
    const { _id, ...rest } = entry.doc;
    return { ...rest, id: _id };
  }

  return entry;
}
