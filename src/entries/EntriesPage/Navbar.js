import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";

import SidebarMenu from "../../components/SidebarMenu";
import { NavbarTitle } from "../../components/NavbarTitle";

const Navbar = () => {
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
          <NavbarTitle />
          <div style={{ width: 48 }} />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
