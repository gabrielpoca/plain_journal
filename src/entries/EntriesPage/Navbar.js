import React, { useContext } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";

import SidebarMenu from "../../components/SidebarMenu";
import { NavbarTitle } from "../../components/NavbarTitle";
import { SearchContext } from "../../core/Search";

const Navbar = () => {
  const { toggle } = useContext(SearchContext);

  return (
    <AppBar position="fixed">
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
            <IconButton onClick={() => toggle()}>
              <SearchIcon />
            </IconButton>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
