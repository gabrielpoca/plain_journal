import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { isDone } from '../db';
import Habit from './Habit';
import NewHabitForm from './NewHabitForm';

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
    flex: '1',
    width: '100%',
    display: 'flex',
    marginBottom: theme.spacing.unit * 6,
  },
});

class HabitsList extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ul className={classes.list}>
          {this.props.habits.map(habit => (
            <li className={classes.item} key={habit._id}>
              <Habit
                done={isDone(habit)}
                onClick={this.props.onToggle}
                habit={habit}
              />
            </li>
          ))}
        </ul>
        <NewHabitForm />
      </div>
    );
  }
}

export default withStyles(styles)(HabitsList);
