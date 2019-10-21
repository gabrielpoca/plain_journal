import { useState, useEffect } from "react";
import uuidv1 from "uuid/v1";
import moment from "moment";
import { useObservable } from "rxjs-hooks";
import { map } from "rxjs/operators";

export const setup = async db => {
  await db.collection({
    name: "entries",
    schema: {
      title: "entries",
      version: 4,
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
          encrypted: true
        },
        latitude: {
          type: "number"
        },
        longitude: {
          type: "number"
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
      4: doc => doc
    },
    statics: {
      useEntry: id => {
        const { entry } = useObservable(
          () => db.entries.findOne(id).$.pipe(map(found => ({ entry: found }))),
          { entry: undefined },
          [id]
        );

        return entry;
      },
      useSearchEntries: (q, searchResult) => {
        const [res, setRes] = useState([]);

        useEffect(() => {
          let query = null;

          if (q) {
            query = db.entries.find({
              id: {
                $in: searchResult.map(r => r.ref)
              }
            });
          } else {
            query = db.entries.find();
          }

          const sub = query
            .sort("date")
            .$.pipe(map(val => val.reverse()))
            .subscribe(newRes => setRes(newRes));

          return () => {
            sub.unsubscribe();
          };
        }, [q, searchResult]);

        return res;
      }
    }
  });

  db.entries.preInsert(newEntryRaw => {
    if (!newEntryRaw.id) newEntryRaw.id = uuidv1();

    if (typeof newEntryRaw.date !== "string")
      newEntryRaw.date = moment(newEntryRaw.date).format("YYYY-MM-DD");
  }, true);

  db.entries.preSave(newEntryRaw => {
    if (typeof newEntryRaw.date !== "string")
      newEntryRaw.date = moment(newEntryRaw.date).format("YYYY-MM-DD");
  }, true);
};
