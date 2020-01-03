import get from "lodash/get";
import React, { useContext } from "react";
import { map } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";
import SwitchInput from "@material-ui/core/Switch";
import MomentUtils from "@date-io/moment";
import moment from "moment";
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
import { askForPermissioToReceiveNotifications } from "../notifications";
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
  const currentUser = useObservable(() => user$);

  const toggleReminders = async () => {
    askForPermissioToReceiveNotifications();

    if (!reminder) {
      return await db.push_notifications.insert({
        id: "journalReminder",
        enabled: true
      });
    }

    return await reminder.update({
      $set: {
        enabled: !reminder.enabled
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

  return (
    <>
      <Grid container justify="space-between" spacing={1}>
        <Grid item xs={8}>
          <Typography>Reminders</Typography>
        </Grid>
        <Grid item xs={3} sm={2}>
          <Box display="flex" justifyContent="flex-end">
            <SwitchInput
              disabled={!currentUser}
              onChange={toggleReminders}
              checked={
                get(reminder, "enabled", false) &&
                !!get(reminder, "subscription")
              }
            />
          </Box>
        </Grid>
      </Grid>
      {!currentUser && (
        <Box paddingLeft="20px" maxWidth="600px">
          <Typography>
            I only can send you reminders, if you create an account. This is an
            unfortunate limitation of the platform."{" "}
          </Typography>
        </Box>
      )}
      {currentUser && get(reminder, "enabled", false) && (
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
                        //autoOk
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
