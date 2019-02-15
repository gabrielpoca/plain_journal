import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import SidebarMenu from '../../components/SidebarMenu';

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

const Navbar = withStyles(styles)(({ classes }) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <SidebarMenu />
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
