import _ from "lodash";
import uuidv1 from "uuid/v1";

import DB from "../DB";
import {
  onRemoteEntryDeleted,
  updateRemoteEntry,
  onRemoteUpdateChanged,
  onLocalEntryDeleted
} from "./localToRemote";

describe("updateRemoteEntry", () => {
  test("calls the remote database with the right arguments", async () => {
    const entry = buildNewEntry();
    const remoteDB = { insert: jest.fn(() => ({ ok: true })) };

    await updateRemoteEntry(remoteDB, entry);

    const allowedFields = _.pick(entry, ["body", "date"]);
    expect(remoteDB.insert).toHaveBeenCalledWith(allowedFields, "1");
  });

  test("updates the local entry with the new rev", async () => {
    const entry = await insertRemoteExistingEntry();
    const remoteDB = { insert: jest.fn(() => ({ ok: true, rev: "new-rev" })) };

    await updateRemoteEntry(remoteDB, entry);

    const updatedEntry = await DB.entries.get(entry.id);
    expect(updatedEntry).toMatchObject({
      _rev: "new-rev",
      dirty: "false"
    });
  });

  test("throws if there is an error", async () => {
    const entry = await insertRemoteExistingEntry();
    const remoteDB = {
      insert: jest.fn(() => {
        const e = new Error();
        e.statusCode = 500;
        throw e;
      })
    };

    expect(updateRemoteEntry(remoteDB, entry)).rejects.toThrow();
  });

  test("throws if the remote response is not ok", async () => {
    const entry = await insertRemoteExistingEntry();
    const remoteDB = {
      insert: jest.fn(() => ({ ok: false }))
    };

    expect(updateRemoteEntry(remoteDB, entry)).rejects.toThrow();
  });
});

describe("onLocalEntryDeleted", () => {
  test("deletes the remote entry", async () => {
    const remoteDB = { destroy: jest.fn(() => true) };

    await onLocalEntryDeleted(remoteDB, { id: "1", _rev: "rev" });

    expect(remoteDB.destroy).toHaveBeenCalledWith("1", "rev");
  });

  test("deletes the local entry", async () => {
    const entry = { id: "1", _rev: "rev" };
    const remoteDB = { destroy: jest.fn(() => true) };
    DB.entries.put(entry);

    await onLocalEntryDeleted(remoteDB, entry);

    expect(await DB.entries.get(entry.id)).toBeUndefined();
  });

  test("does not delete the remote entry if there is no ref", async () => {
    const entry = { id: "1" };
    const remoteDB = { destroy: jest.fn(() => true) };
    DB.entries.put(entry);

    await onLocalEntryDeleted(remoteDB, entry);

    expect(remoteDB.destroy).not.toHaveBeenCalled();
    expect(await DB.entries.get(entry.id)).toBeUndefined();
  });

  test("ignores the error if the remote entry does not exist", async () => {
    const entry = { id: "1", _rev: "avmos" };
    const remoteDB = {
      destroy: jest.fn(() => {
        const e = new Error();
        e.statusCode = 404;
        throw e;
      })
    };
    DB.entries.put(entry);

    await onLocalEntryDeleted(remoteDB, entry);

    expect(await DB.entries.get(entry.id)).toBeUndefined();
  });
});

describe("onRemoteEntryDeleted", () => {
  test("deletes the local entry when it's not dirty", async () => {
    const id = uuidv1();

    DB.entries.put({ id });

    await onRemoteEntryDeleted({ id });

    expect(await DB.entries.get(id)).toBeUndefined();
  });

  test("creates a new local entry when the entry is dirty", async () => {
    const id = uuidv1();
    const body = "dirty issue body";
    const entry = { id, body, dirty: "true" };

    DB.entries.put(entry);

    await onRemoteEntryDeleted(entry);

    const newEntry = await DB.entries.get({ dirty: "true" });

    expect(await DB.entries.get(id)).toBeUndefined();
    expect(newEntry.body).toEqual(body);
  });
});

describe("onRemoteUpdateChanged", () => {
  test("creates a copy of the local entry", async () => {
    const localEntry = {
      id: "1",
      _rev: "2",
      body: "Local body",
      dirty: "true",
      deleted: "true"
    };
    await DB.entries.put(localEntry);
    const remoteEntry = { id: "1", _rev: "3", body: "Remote body" };
    const remoteDB = { get: jest.fn(() => remoteEntry) };

    const newLocalEntryId = await onRemoteUpdateChanged(remoteDB, localEntry);

    const newLocalEntry = await DB.entries.get(newLocalEntryId);
    const previousLocalEntry = await DB.entries.get(remoteEntry.id);

    expect(newLocalEntry).toMatchObject({
      body: localEntry.body,
      dirty: "true",
      deleted: "true"
    });
    expect(previousLocalEntry).toMatchObject(remoteEntry);
  });
});

const buildNewEntry = (overrides = {}) =>
  _.merge(
    {
      id: "1",
      body: "Local body",
      date: "2019-12-13"
    },
    overrides
  );

const buildRemoteExistingEntry = (overrides = {}) =>
  _.merge(
    {
      id: "1",
      _rev: "2",
      body: "Local body",
      date: "2019-12-13"
    },
    overrides
  );

const insertRemoteExistingEntry = overrides => {
  const entry = buildRemoteExistingEntry(overrides);
  DB.entries.put(entry);
  return entry;
};
