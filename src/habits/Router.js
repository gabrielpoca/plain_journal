import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import { habits, toggleHabit } from './db';
import HabitsList from './components/HabitsList';
import Tabs from './components/Tabs';

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

class Dashboard extends React.Component {
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
  };

  onToggle = async habit => {
    await habits.put(toggleHabit(habit));
  };

  render() {
    return (
      <>
        <Tabs
          renderDaily={
            <HabitsList
              onToggle={this.onToggle}
              habits={this.state.habits.filter(h => h.type === 'daily')}
            />
          }
          renderWeekly={
            <HabitsList
              onToggle={this.onToggle}
              habits={this.state.habits.filter(h => h.type === 'weekly')}
            />
          }
        />
      </>
    );
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={withStyles(styles)(Dashboard)} />
  </Switch>
);
