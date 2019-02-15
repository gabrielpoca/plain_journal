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

import * as key from '../key';

import { askForPermissioToReceiveNotifications } from '../notifications';
import { KeyValueStorage } from '../KeyValueStorage';

import RemoteSyncDialog from './RemoteSyncDialog';
import ErrorNotification from './ErrorNotification';
import Navbar from './Navbar';

class Dashboard extends React.PureComponent {
  static contextType = KeyValueStorage;
  state = {
    error: null,
    remoteSyncOpen: false,
  };

  remindersAllowed = () => {
    return (
      Notification.permission === 'granted' &&
      this.context.getItem('remindersAllowed')
    );
  };

  onErrorClose = (event, reason) => {
    if (reason === 'clickaway') return;

    this.setState({ error: false });
  };

  onReminder = async () => {
    try {
      if (!this.remindersAllowed()) {
        await askForPermissioToReceiveNotifications();
        this.context.setItem('remindersAllowed', true);
      } else {
        this.context.setItem('remindersAllowed', false);
      }
    } catch (e) {
      this.setState({ error: 'Something nice' });
    }
  };

  onRemoteSyncToggle = async () => {
    if (!this.context.getItem('remoteSync'))
      this.setState({ remoteSyncOpen: !this.state.remoteSyncOpen });
    else {
      await key.destroy();
      this.context.setItem('remoteSync', false);
    }
  };

  onRemoteSyncEnable = async values => {
    this.onRemoteSyncToggle();

    key.setup(values.username, values.password);
    this.context.setItem('remoteSync', true);
  };

  render() {
    return (
      <KeyValueStorage>
        {({ getItem, setItem }) => {
          const journaling = getItem('trackJournaling') || false;
          const reminders = getItem('remindersAllowed') || false;
          const remoteSync = getItem('remoteSync') || false;

          return (
            <>
              <RemoteSyncDialog
                onClose={this.onRemoteSyncToggle}
                open={this.state.remoteSyncOpen}
                onSubmit={this.onRemoteSyncEnable}
              />
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
                      checked={reminders}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AlarmIcon />
                  </ListItemIcon>
                  <ListItemText primary="Track Journaling" />
                  <ListItemSecondaryAction>
                    <SwitchInput
                      onChange={() => setItem('trackJournaling', !journaling)}
                      checked={journaling}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AlarmIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sync to remote server" />
                  <ListItemSecondaryAction>
                    <SwitchInput
                      onChange={this.onRemoteSyncToggle}
                      checked={remoteSync}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </>
          );
        }}
      </KeyValueStorage>
    );
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={Dashboard} />
  </Switch>
);
