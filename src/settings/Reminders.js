import get from "lodash/get";
import React, { useContext } from "react";
import { map } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";
import SwitchInput from "@material-ui/core/Switch";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { toast } from "react-toastify";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from "@material-ui/pickers";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { DBContext } from "../core/Database";
import { user$ } from "../core/User";
import { PushNotifications } from "../core/PushNotifications";
import { theme } from "../theme";

function useReminder(db) {
  const value = useObservable(
    () =>
      db.push_notifications
        .findOne("journalReminder")
        .$.pipe(map(setting => ({ setting }))),
    { setting: undefined },
    []
  );

  return value.setting;
}

export function Reminders() {
  const { db } = useContext(DBContext);
  const reminder = useReminder(db);
  const userObserver = useObservable(() => user$);

  const currentUser = get(userObserver, "user");

  const enableReminders = async () => {
    try {
      await PushNotifications.askForPermission();

      if (!reminder) {
        return await db.push_notifications.insert({
          id: "journalReminder",
          enabled: true
        });
      }

      await reminder.update({
        $set: {
          enabled: !reminder.enabled
        }
      });
    } catch (e) {
      if (e.name === "AbortError")
        toast.error("This browser does not support reminders", {});
      else if (e.name === "NotAllowedError")
        toast.error("You must allow sending notifications", {});
      else console.error(e.name);
    }
  };

  const disableReminders = () => {
    reminder.update({
      $set: {
        enabled: false
      }
    });
  };

  const setTime = time => {
    reminder.update({
      $set: {
        time: {
          hour: time.hour(),
          minute: time.minute()
        }
      }
    });
  };

  const available = currentUser && PushNotifications.available();
  const enabled =
    currentUser &&
    get(reminder, "enabled", false) &&
    get(reminder, "subscription") &&
    PushNotifications.enabled();

  return (
    <>
      <Grid container justify="space-between" spacing={1}>
        <Grid item xs={8}>
          <Typography>Reminders</Typography>
        </Grid>
        <Grid item xs={3} sm={2}>
          <Box display="flex" justifyContent="flex-end">
            <SwitchInput
              disabled={!available}
              onChange={enabled ? disableReminders : enableReminders}
              checked={!!enabled}
            />
          </Box>
        </Grid>
      </Grid>
      {!PushNotifications.available() && (
        <Box paddingLeft="20px" maxWidth="600px">
          <Typography>Reminders are not supported in your platform.</Typography>
        </Box>
      )}
      {!currentUser && PushNotifications.available() && (
        <Box paddingLeft="20px" maxWidth="600px">
          <Typography>
            I only can send you reminders, if you create an account. This is an
            unfortunate limitation of the platform.
          </Typography>
        </Box>
      )}
      {enabled && (
        <Grid container>
          <Grid container item xs={12} sm={6}>
            <Grid item xs={11}>
              <Typography>When do you want to be reminded?</Typography>
            </Grid>
          </Grid>
          <Grid container justify="flex-end" item xs={12} sm={6}>
            <Grid item xs={11}>
              <Box display="flex" justifyContent="flex-end">
                <Box flexBasis="130px" flexGrow="0">
                  <MuiThemeProvider
                    theme={{
                      ...theme,
                      palette: {
                        ...theme.palette,
                        background: {
                          ...theme.palette.background,
                          paper: "#333"
                        }
                      }
                    }}
                  >
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={moment()
                          .hour(get(reminder, "time.hour", 20))
                          .minute(get(reminder, "time.minute", 30))}
                        onChange={setTime}
                        KeyboardButtonProps={{
                          color: "secondary",
                          "aria-label": "change time"
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </MuiThemeProvider>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
