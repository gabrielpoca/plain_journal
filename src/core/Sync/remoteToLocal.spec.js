import uuidv1 from "uuid/v1";
import _ from "lodash";
import localForage from "localforage";

import DB from "../DB";
import Session from "../Session";
import remoteToLocal from "./remoteToLocal";

beforeEach(async () => {
  await localForage.setItem("last_seq", undefined);
});

describe("default", () => {
  test("requests changes starting in the current last_seq", async () => {
    await localForage.setItem("last_seq", 2);
    const remoteDB = getRemoteDB({ results: [], last_seq: 101 });

    await remoteToLocal(remoteDB);

    expect(remoteDB.changes).toHaveBeenCalledWith({
      include_docs: true,
      since: 2
    });
  });

  test("the default last_seq is 0", async () => {
    const remoteDB = getRemoteDB({ results: [], last_seq: 101 });

    await remoteToLocal(remoteDB);

    expect(remoteDB.changes).toHaveBeenCalledWith({
      include_docs: true,
      since: 0
    });
  });

  test("updates the last_seq", async () => {
    const remoteDB = getRemoteDB({ results: [], last_seq: 101 });

    await remoteToLocal(remoteDB);

    expect(await localForage.getItem("last_seq")).toEqual(101);
  });

  test("decrypts the remote entry", async () => {
    const remoteEntry = buildRemoteEntry();
    const remoteDB = getRemoteDB({
      results: [remoteEntry],
      last_seq: 101
    });

    await remoteToLocal(remoteDB);

    expect(Session.decrypt).toHaveBeenCalledWith(remoteEntry.doc.body);
  });

  test("creates a new local entry if it doesn't exist", async () => {
    const remoteEntry = buildRemoteEntry();
    const remoteDB = getRemoteDB({
      results: [remoteEntry],
      last_seq: 101
    });

    await remoteToLocal(remoteDB);

    const localEntry = await DB.entries.get(remoteEntry.doc._id);
    expect(localEntry).toMatchObject({
      ..._.omit(remoteEntry.doc, ["_id"]),
      id: remoteEntry.doc._id
    });
  });

  test("doesn't do anything if the local entry is already up to date", async () => {
    const remoteEntry = buildRemoteEntry();
    const remoteDB = getRemoteDB({
      results: [remoteEntry],
      last_seq: 101
    });
    await putLocalEntry(remoteEntry, { body: "not-same" });
    await remoteToLocal(remoteDB);

    const localEntry = await DB.entries.get(remoteEntry.doc._id);
    expect(localEntry.body).toEqual("not-same");
  });

  test("duplicates the local entry if it's dirty with a different _rev", async () => {
    const dirtyBody = "dirty body";
    const remoteEntry = buildRemoteEntry();
    const remoteDB = getRemoteDB({ ok: true, results: [remoteEntry] });

    await DB.entries.put({
      ..._.omit(remoteEntry.doc, ["_id"]),
      id: remoteEntry.doc._id,
      _rev: uuidv1(),
      dirty: "true",
      body: dirtyBody
    });

    await remoteToLocal(remoteDB);

    const localEntry = await DB.entries.get(remoteEntry.doc._id);
    expect(localEntry.body).toEqual(remoteEntry.doc.body);
    expect(localEntry._rev).toEqual(remoteEntry.doc._rev);

    const newLocalEntry = await DB.entries.get({ dirty: "true" });
    expect(newLocalEntry.body).toEqual(dirtyBody);
  });

  test("updates the local entry", async () => {
    const remoteEntry = buildRemoteEntry();
    const remoteDB = getRemoteDB({ ok: true, results: [remoteEntry] });

    await DB.entries.put({
      ..._.omit(remoteEntry.doc, ["_id"]),
      _rev: uuidv1(),
      id: remoteEntry.doc._id
    });

    await remoteToLocal(remoteDB);

    const localEntry = await DB.entries.get(remoteEntry.doc._id);
    expect(localEntry._rev).toEqual(remoteEntry.doc._rev);
  });

  test("deletes the local entry", async () => {
    const remoteEntry = buildRemoteEntry();
    const remoteDB = getRemoteDB({
      ok: true,
      results: [
        {
          deleted: true,
          id: remoteEntry.doc._id
        }
      ]
    });

    await putLocalEntry(remoteEntry, { deleted: false });
    await remoteToLocal(remoteDB);

    const localEntry = await DB.entries.get(remoteEntry.doc._id);
    expect(localEntry).toBeUndefined();
  });
});

const getRemoteDB = changesResponse => {
  return {
    changes: jest.fn(() => changesResponse)
  };
};

const buildRemoteEntry = () => {
  const id = uuidv1();
  const rev = uuidv1();

  return {
    _id: id,
    _rev: rev,
    doc: {
      _id: id,
      _rev: rev,
      deleted: "false",
      body: "Remote body",
      date: "2019-12-13"
    }
  };
};

const putLocalEntry = (remoteEntry, overrides = {}) => {
  DB.entries.put(
    _.merge(
      {
        id: remoteEntry._id,
        ..._.omit(remoteEntry.doc, ["_id"])
      },
      overrides
    )
  );
};
