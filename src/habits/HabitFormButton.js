import React from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import HabitForm from './HabitForm';

const styles = theme => ({});

class HabitFormButton extends React.Component {
  state = {
    open: false,
  };

  onToggle = () => this.setState({ open: !this.state.open });

  onSubmit = () => console.log('sub');

  render() {
    return (
      <>
        <Button variant="outlined" color="primary" onClick={this.onToggle}>
          New Habit
        </Button>
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
