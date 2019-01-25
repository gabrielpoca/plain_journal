import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import SidebarMenu from '../components/SidebarMenu';

const styles = theme => ({});

const Navbar = withStyles(styles)(({ classes, onSearch, searchQuery }) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton component={Link} to="/" color="inherit" aria-label="Close">
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
