import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => {
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      height: '100%',
    },
  };
};

export default withStyles(styles)(({ classes, children }) => (
  <div className={classes.root}>{children}</div>
));
