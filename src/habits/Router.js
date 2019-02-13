import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import { KeyValueStorage } from '../KeyValueStorage';
import { habits, toggleHabit } from './db';
import HabitsList from './components/HabitsList';
import Tabs from './components/Tabs';
import BottomNavbar from '../components/BottomNavbar';
import entriesDB from '../db';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
  },
  item: {
    listStyleType: 'none',
    flexBasis: '120px',
    width: '120px',
    display: 'flex',
  },
});

class Dashboard extends React.PureComponent {
  static contextType = KeyValueStorage;

  state = {
    habits: [],
  };

  componentWillMount() {
    this.sub = habits
      .changes({
        since: 'now',
        live: true,
      })
      .on('change', this.update);
    this.update();
  }

  componentWillUnmount() {
    this.sub.cancel();
  }

  update = async () => {
    const docs = await habits.allDocs({ include_docs: true });
    this.setState({ habits: docs.rows.map(r => r.doc) });

    const entries = await entriesDB.find({ selector: {} });
    this.setState({ journalEntries: entries.docs });
  };

  onToggle = async habit => {
    if (!habit.static) await habits.put(toggleHabit(habit));
  };

  render() {
    const habits =
      this.context.getItem('trackJournaling') && this.state.journalEntries
        ? [
            {
              static: true,
              _id: 'journaling',
              title: 'Journaling',
              entries: this.state.journalEntries,
            },
          ]
        : [];

    return (
      <>
        <Tabs
          renderDaily={() => {
            return (
              <HabitsList
                onToggle={this.onToggle}
                habits={this.state.habits
                  .filter(h => h.type === 'daily')
                  .concat(habits)}
              />
            );
          }}
          renderWeekly={() => (
            <HabitsList
              onToggle={this.onToggle}
              habits={this.state.habits.filter(h => h.type === 'weekly')}
            />
          )}
        />
        <BottomNavbar />
      </>
    );
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={withStyles(styles)(Dashboard)} />
  </Switch>
);
