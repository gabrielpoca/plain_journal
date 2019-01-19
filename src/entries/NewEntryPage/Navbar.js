import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  toolbar: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

const Navbar = props => (
  <AppBar position="sticky">
    <Toolbar className={props.classes.toolbar}>
      <IconButton color="inherit" component={Link} to="/" aria-label="Close">
        <CloseIcon />
      </IconButton>
      <IconButton color="inherit" onClick={props.onSave} aria-label="Save">
        <SaveIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Navbar);
