import React from "react";
import styled from "styled-components/macro";
import { Route, Link } from "react-router-dom";
import { withRouter } from "react-router";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { SearchConsumer } from "../Search";

const styles = theme => ({
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  }
});

const SpacedToolbar = styled(Toolbar)`
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-direction: row;
`;

const options = ["None", "Atria", "Callisto", "Dione"];

const ITEM_HEIGHT = 48;

class LongMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <>
        <Link to="/">
          <IconButton aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Link>
        <IconButton
          aria-label="More"
          aria-owns={open ? "long-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200
            }
          }}
        >
          {options.map(option => (
            <MenuItem
              key={option}
              selected={option === "Pyxis"}
              onClick={this.handleClose}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
}

class Navbar extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="sticky">
        <SpacedToolbar>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <IconButton color="inherit" aria-label="Menu">
                  <MenuIcon />
                </IconButton>
                <SearchConsumer>
                  {({ searchQuery, onSearch }) => (
                    <InputBase
                      onChange={onSearch}
                      value={searchQuery}
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput
                      }}
                    />
                  )}
                </SearchConsumer>
              </React.Fragment>
            )}
          />
          <Route
            path="/entry/:id"
            render={() => <LongMenu {...this.props} />}
          />
        </SpacedToolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(styles)(Navbar));
