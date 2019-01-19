import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';

import SidebarMenu from '../components/SidebarMenu';

const styles = theme => ({
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
});

const Navbar = withStyles(styles)(({ classes, onSearch, searchQuery }) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <SidebarMenu />
        <InputBase
          onChange={onSearch}
          value={searchQuery}
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
