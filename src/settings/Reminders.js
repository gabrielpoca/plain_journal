import React, { useContext } from "react";
import { map } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AlarmIcon from "@material-ui/icons/AccessAlarm";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import SwitchInput from "@material-ui/core/Switch";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from "@material-ui/pickers";
import { MuiThemeProvider } from "@material-ui/core/styles";

import { DBContext } from "../core/Database";
import { user$ } from "../core/User";
import { askForPermissioToReceiveNotifications } from "../notifications";
import { theme } from "../theme";

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

export function Reminders() {
  const { db } = useContext(DBContext);
  const reminder = useJournalSetting(db);
  const currentUser = useObservable(() => user$);

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

  const setTime = time => {
    reminder.update({
      $set: {
        "values.time": time.toDate()
      }
    });
  };

  return (
    <>
      <ListItem disableGutters>
        <ListItemIcon>
          <AlarmIcon />
        </ListItemIcon>
        <ListItemText primary="Journaling Reminders" />
        <ListItemSecondaryAction>
          <SwitchInput
            disabled={!currentUser}
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
      {!currentUser && (
        <ListItem disableGutters>
          <ListItemText secondary="Because of some limitations of the platform, I only can send you notifications, if you create an account." />
        </ListItem>
      )}
      {!!currentUser && reminder && reminder.values && reminder.values.enabled && (
        <ListItem disableGutters>
          <ListItemText inset primary="When do you want to be reminded?" />
          <ListItemSecondaryAction>
            <MuiThemeProvider
              theme={{
                ...theme,
                palette: {
                  ...theme.palette,
                  background: { ...theme.palette.background, paper: "#333" }
                }
              }}
            >
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardTimePicker
                  //autoOk
                  margin="normal"
                  id="time-picker"
                  label="Time picker"
                  value={moment(reminder.values.time)}
                  onChange={setTime}
                  KeyboardButtonProps={{
                    color: "secondary",
                    "aria-label": "change time"
                  }}
                />
              </MuiPickersUtilsProvider>
            </MuiThemeProvider>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </>
  );
}
