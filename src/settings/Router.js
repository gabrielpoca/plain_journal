import React from 'react';
import { Route, Switch } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SwitchInput from '@material-ui/core/Switch';
import AlarmIcon from '@material-ui/icons/AccessAlarm';

import { askForPermissioToReceiveNotifications } from '../notifications';

import ErrorNotification from './ErrorNotification';
import Navbar from './Navbar';

const remindersAllowed = () => {
  return (
    Notification.permission === 'granted' &&
    localStorage.getItem('remindersAllowed') === 'true'
  );
};

class Dashboard extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      error: null,
      remindersAllowed: remindersAllowed(),
    };
  }

  onErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ error: false });
  };

  onReminder = async () => {
    try {
      if (!this.state.remindersAllowed) {
        await askForPermissioToReceiveNotifications();
        localStorage.setItem('remindersAllowed', 'true');
      } else {
        localStorage.setItem('remindersAllowed', 'false');
      }
    } catch (e) {
      this.setState({ error: 'Something nice' });
    }

    this.setState({
      remindersAllowed: remindersAllowed(),
    });
  };

  render() {
    return (
      <>
        <Navbar />
        <ErrorNotification
          open={!!this.state.error}
          message={this.state.error}
          onClose={this.onErrorClose}
        />
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <AlarmIcon />
            </ListItemIcon>
            <ListItemText primary="Journaling Reminders" />
            <ListItemSecondaryAction>
              <SwitchInput
                onChange={this.onReminder}
                checked={this.state.remindersAllowed}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </>
    );
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={Dashboard} />
  </Switch>
);
