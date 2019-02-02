import _ from 'lodash';
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { isDone } from '../db';

const styles = theme => {
  const size = theme.spacing.unit * 14;

  return {
    root: {
      display: 'flex',
      flex: '1',
      height: `${size}px`,
      justifyContent: 'center',
    },
    button: {
      alignItems: 'center',
      background: theme.palette.common.white,
      borderColor: theme.palette.common.black,
      borderStyle: 'solid',
      borderRadius: '50%',
      borderWidth: '3px',
      display: 'flex',
      flexBasis: `${size}px`,
      justifyContent: 'center',
      position: 'relative',
      outline: 'none',
    },
    done: {
      borderColor: theme.palette.secondary['500'],
    },
    label: {},
    desc: {
      position: 'absolute',
      left: `calc(100% + ${theme.spacing.unit * 2}px)`,
      top: '50%',
      transform: 'translateY(-50%)',
    },
  };
};

class Habit extends React.PureComponent {
  render() {
    const { classes, habit } = this.props;

    return (
      <div className={classes.root}>
        <button
          onClick={() => this.props.onClick(this.props.habit)}
          className={`${classes.button} ${isDone(habit) ? classes.done : null}`}
        >
          <Typography className={classes.label} variant="button">
            {habit.title}
          </Typography>
          <Typography className={classes.desc}>
            {_.get(habit.entries, 'length', 0)}
          </Typography>
        </button>
      </div>
    );
  }
}

export default withStyles(styles)(Habit);
