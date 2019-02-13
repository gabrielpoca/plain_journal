import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import { KeyValueStorage } from '../KeyValueStorage';
import { db, toggleHabit } from './db';
import HabitsList from './components/HabitsList';
import Tabs from './components/Tabs';
import BottomNavbar from '../components/BottomNavbar';

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
    this.sub = db
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
    const habits = (await db.find({
      selector: {
        doc_type: 'habit',
      },
    })).docs;
    this.setState({ habits });

    const journalEntries = (await db.find({
      selector: {
        doc_type: 'journal',
      },
    })).docs;
    this.setState({ journalEntries });
  };

  onToggle = async habit => {
    if (!habit.static) await db.put(toggleHabit(habit));
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
