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
import { KeyValueStorage } from '../KeyValueStorage';

import ErrorNotification from './ErrorNotification';
import Navbar from './Navbar';

class Dashboard extends React.PureComponent {
  static contextType = KeyValueStorage;

  constructor() {
    super();

    this.state = {
      error: null,
    };
  }

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

  render() {
    return (
      <KeyValueStorage>
        {({ getItem, setItem }) => {
          const journaling = getItem('trackJournaling');
          const reminders = getItem('remindersAllowed');

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
