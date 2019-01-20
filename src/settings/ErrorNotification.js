import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import amber from '@material-ui/core/colors/amber';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  root: {
    backgroundColor: amber[700],
  },
});

class ErrorNotification extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={this.props.open}
        autoHideDuration={6000}
        onClose={this.props.onClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.props.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.props.onClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

export default withStyles(styles)(ErrorNotification);
