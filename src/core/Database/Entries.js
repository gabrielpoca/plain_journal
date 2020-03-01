import uuidv1 from "uuid/v1";
import moment from "moment";

const setupHooks = collection => {
  collection.preInsert(newEntryRaw => {
    if (!newEntryRaw.id) newEntryRaw.id = uuidv1();

    if (typeof newEntryRaw.date !== "string")
      newEntryRaw.date = moment(newEntryRaw.date).format("YYYY-MM-DD");
  }, true);

  collection.preSave(newEntryRaw => {
    if (typeof newEntryRaw.date !== "string")
      newEntryRaw.date = moment(newEntryRaw.date).format("YYYY-MM-DD");
  }, true);
};

export const setup = async (db, encrypted = false) => {
  await db.collection({
    name: "entries",
    schema: {
      title: "entries",
      version: 5,
      type: "object",
      properties: {
        id: {
          type: "string",
          primary: true
        },
        date: {
          type: "string",
          index: true,
          format: "date-time"
        },
        body: {
          type: "string",
          encrypted: encrypted
        },
        latitude: {
          type: "number",
          encrypted: encrypted
        },
        longitude: {
          type: "number",
          encrypted: encrypted
        },
        modelType: {
          type: "string",
          final: true,
          default: "journalEntry"
        }
      },
      required: ["id", "date", "body", "modelType"]
    },
    migrationStrategies: {
      1: fn => fn,
      2: fn => fn,
      3: doc => {
        return { ...doc, date: moment(doc.date, "YYYY-MM-DD").format() };
      },
      4: doc => doc,
      5: doc => doc
    }
  });

  setupHooks(db.entries);
};
