import React, { useContext, useEffect } from "react";
import { map } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AlarmIcon from "@material-ui/icons/AccessAlarm";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import SwitchInput from "@material-ui/core/Switch";

import { DBContext } from "../core/Database";
import { askForPermissioToReceiveNotifications } from "../notifications";
import { token$ } from "../notifications";

function useJournalSetting(db) {
  const value = useObservable(
    () =>
      db.settings
        .findOne("journalReminders")
        .$.pipe(map(setting => ({ setting }))),
    { setting: undefined },
    []
  );

  return value.setting;
}

export function RemindersToggle() {
  const { db } = useContext(DBContext);
  const reminder = useJournalSetting(db);
  const token = useObservable(() => token$);

  useEffect(() => {
    if (!reminder || !token) return;
    if (!reminder.values.enabled) return;

    reminder.update({
      $set: {
        "values.token": token
      }
    });
  }, [reminder, token]);

  const toggleReminders = async () => {
    askForPermissioToReceiveNotifications();

    if (!reminder) {
      return await db.settings.insert({
        id: "journalReminders",
        value: "",
        values: {
          enabled: true
        }
      });
    }

    return await reminder.update({
      $set: {
        "values.enabled": !reminder.values.enabled
      }
    });
  };

  return (
    <ListItem disableGutters>
      <ListItemIcon>
        <AlarmIcon />
      </ListItemIcon>
      <ListItemText primary="Journaling Reminders" />
      <ListItemSecondaryAction>
        <SwitchInput
          onChange={toggleReminders}
          checked={
            !!reminder &&
            reminder.values &&
            reminder.values.enabled &&
            !!reminder.values.token
          }
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
