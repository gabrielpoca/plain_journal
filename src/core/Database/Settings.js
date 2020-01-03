import { useObservable } from "rxjs-hooks";
import { map } from "rxjs/operators";

export const setup = async db => {
  await db.collection({
    name: "settings",
    schema: {
      title: "settings",
      version: 3,
      type: "object",
      properties: {
        id: {
          type: "string",
          primary: true
        },
        value: {
          type: "string"
        },
        values: {
          type: "object",
          additionalProperties: true
        },
        modelType: {
          type: "string",
          final: true,
          default: "setting"
        }
      },
      required: ["id", "value", "modelType"]
    },
    migrationStrategies: {
      1: fn => fn,
      2: doc => {
        return { ...doc, modelType: "setting" };
      },
      3: doc => {
        return { ...doc, value: doc.value || "", values: {} };
      }
    },
    statics: {
      useSetting: id => {
        const value = useObservable(
          () =>
            db.settings.findOne(id).$.pipe(map(found => ({ setting: found }))),
          { setting: undefined },
          [id]
        );

        return value.setting;
      }
    }
  });
};
