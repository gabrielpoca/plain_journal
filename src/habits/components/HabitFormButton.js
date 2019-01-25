import React from 'react';

import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import HabitForm from './HabitForm';
import { newID } from '../../utils';

import { habits } from '../db';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class HabitFormButton extends React.PureComponent {
  state = {
    open: false,
  };

  onToggle = () => this.setState({ open: !this.state.open });

  onSubmit = async args => {
    await habits.put({ ...args, _id: newID() });
    this.setState({ open: false });
  };

  render() {
    return (
      <>
        <Fab
          className={this.props.classes.fab}
          aria-label="Add"
          color="secondary"
          onClick={this.onToggle}
        >
          <AddIcon />
        </Fab>
        <HabitForm
          open={this.state.open}
          onSubmit={this.onSubmit}
          onClose={this.onToggle}
        />
      </>
    );
  }
}

export default withStyles(styles)(HabitFormButton);
