import { filter } from "rxjs/operators";
import { combineLatest } from "rxjs";

import { PushNotifications } from "../PushNotifications";

export const setup = async db => {
  await db.collection({
    name: "push_notifications",
    schema: {
      title: "push_notifications",
      version: 1,
      type: "object",
      properties: {
        id: {
          type: "string",
          primary: true
        },
        enabled: {
          type: "boolean",
          default: true
        },
        subscription: {
          type: "string",
          additionalProperties: true
        },
        time: {
          type: "object",
          additionalProperties: true
        },
        modelType: {
          type: "string",
          final: true,
          default: "pushNotifications"
        }
      },
      required: ["id", "enabled", "modelType"]
    },
    migrationStrategies: {
      1: doc => {
        if (doc.subscription)
          doc.subscription = JSON.stringify(doc.subscription);
        return { ...doc };
      }
    }
  });

  combineLatest(
    PushNotifications.$,
    db.push_notifications.findOne("journalReminder").$
  )
    .pipe(filter(([subscription, reminder]) => subscription && reminder))
    .subscribe(([subscription, reminder]) => {
      if (
        reminder.subscription &&
        reminder.subscription === JSON.stringify(subscription)
      )
        return;

      reminder.update({
        $set: {
          subscription: JSON.stringify(subscription)
        }
      });
    });
};
