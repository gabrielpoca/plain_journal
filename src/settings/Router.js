import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import SwitchInput from "@material-ui/core/Switch";
import AlarmIcon from "@material-ui/icons/AccessAlarm";

import * as Settings from "./db";

import { askForPermissioToReceiveNotifications } from "../notifications";

import Navbar from "./Navbar";

function useSettings() {
  const [settings, setSettings] = useState([]);

  const update = async () => {
    const res = await Settings.all();
    setSettings(res);
  };

  useEffect(() => {
    (async () => {
      await update();
      Settings.onChange(update);
      return () => Settings.off(update);
    })();
  }, []);

  return settings;
}

function RemindersToggle() {
  const settings = useSettings();
  const reminders = _.find(settings, { id: "reminders" }) || { value: false };
  const toggleReminders = async () => {
    let token = null;

    try {
      token = await askForPermissioToReceiveNotifications();
    } catch (e) {
      console.error(e);
    }

    Settings.put({
      id: "reminders",
      value: !reminders.value,
      token
    });
  };

  return (
    <ListItem>
      <ListItemIcon>
        <AlarmIcon />
      </ListItemIcon>
      <ListItemText primary="Journaling Reminders" />
      <ListItemSecondaryAction>
        <SwitchInput onChange={toggleReminders} checked={reminders.value} />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function Dashboard() {
  return (
    <>
      <Navbar />
      <List subheader={<ListSubheader>Settings</ListSubheader>}>
        <RemindersToggle />
      </List>
    </>
  );
}

export default ({ match }) => (
  <Route path={`${match.path}/`} component={Dashboard} />
);
