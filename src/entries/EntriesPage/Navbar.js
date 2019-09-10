import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import SidebarMenu from "../../components/SidebarMenu";
import { NavbarTitle } from "../../components/NavbarTitle";

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="md">
        <Toolbar disableGutters>
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
      </Container>
    </AppBar>
  );
};

export default Navbar;
