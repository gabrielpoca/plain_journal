import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import SidebarMenu from "../../components/SidebarMenu";

const useStyles = makeStyles(theme => ({
  title: {
    fontFamily: "Merriweather",
    fontSize: 20
  }
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <div>
            <SidebarMenu />
          </div>
          <h1 className={classes.title}>Journal</h1>
          <div style={{ width: 48 }} />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
