import uuidv1 from "uuid/v1";
import _ from "lodash";

import DB from "../DB";

export default async userDB => {
  try {
    const entries = await DB.entries.where({ dirty: "true" }).toArray();

    await Promise.all(entries.map(entry => updateEntryWithRemote(entry)));
  } catch (e) {
    console.error("status code", e.statusCode);
    console.error(e.message);
  }

  async function updateEntryWithRemote(entry) {
    try {
      if (entry.deleted === "true") {
        return await handleLocalEntryDeleted(entry);
      }

      return await updateRemoteEntry(entry);
    } catch (e) {
      if (e.statusCode === 409) {
        try {
          await handleRemoteUpdateConflict(entry);
        } catch (e) {
          // it was deleted in the server
          if (e.statusCode === 404) {
            return await handleRemoteEntryDeleted(entry);
          } else {
            throw new Error(e);
          }
        }
      } else {
        throw new Error(e);
      }
    }
  }

  async function updateRemoteEntry(entry) {
    const parsedEntry = _.omit(entry, "id", "dirty");

    const response = await userDB.insert(parsedEntry, entry.id + "");

    if (response.ok) {
      return await DB.entries.update(entry.id, {
        _rev: response.rev,
        dirty: "false"
      });
    } else {
      throw new Error(response);
    }
  }

  async function handleRemoteUpdateConflict(entry) {
    const localEntry = _.omit(entry, "_rev");
    localEntry.dirty = "true";
    const remoteEntry = await userDB.get(entry.id + "");

    await DB.transaction("rw", DB.entries, async () => {
      await DB.entries.put({ ...localEntry, id: uuidv1() });
      return await DB.entries.update(entry.id, remoteEntry);
    });
  }

  async function handleLocalEntryDeleted(entry) {
    try {
      if (entry._rev) await userDB.destroy(entry.id, entry._rev);
    } catch (e) {
      if (e.statusCode === 404) {
        console.warn(`Document ${entry.id} already deleted`);
      } else {
        throw new Error(e);
      }
    }

    return await DB.entries.delete(entry.id);
  }

  async function handleRemoteEntryDeleted(entry) {
    if (entry.dirty === "true") {
      const localEntry = _.omit(entry, "_rev");
      await DB.transaction("rw", DB.entries, async () => {
        await DB.entries.put({ ...localEntry, id: uuidv1() });
        return await DB.entries.delete(entry.id);
      });
    }

    return await DB.entries.delete(entry.id);
  }
};
