import uuidv1 from "uuid/v1";
import { formatISO, format, parse } from "date-fns/esm";

const setupHooks = collection => {
  collection.preInsert(newEntryRaw => {
    if (!newEntryRaw.id) newEntryRaw.id = uuidv1();

    if (typeof newEntryRaw.date !== "string")
      // newEntryRaw.date = format(newEntryRaw.date, "YYYY-MM-DD");
      newEntryRaw.date = formatISO(newEntryRaw.date);
  }, true);

  collection.preSave(newEntryRaw => {
    if (typeof newEntryRaw.date !== "string")
      // newEntryRaw.date = format(newEntryRaw.date, "YYYY-MM-DD");
      newEntryRaw.date = formatISO(newEntryRaw.date);
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
        return { ...doc, date: parse(doc.date, "YYYY-MM-DD", new Date()) };
      },
      4: doc => doc,
      5: doc => doc
    }
  });

  setupHooks(db.entries);
};
