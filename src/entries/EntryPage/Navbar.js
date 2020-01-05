import get from "lodash/get";
import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Toolbar from "@material-ui/core/Toolbar";
import withStyles from "@material-ui/core/styles/withStyles";

import { NavbarTitle } from "../../components/NavbarTitle";

const styles = theme => ({
  toolbar: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row"
  }
});

class LongMenu extends React.PureComponent {
  state = {
    anchorEl: null
  };

  onClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <>
        <IconButton
          color="inherit"
          onClick={this.props.history.goBack}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
        <NavbarTitle />
        <IconButton
          color="inherit"
          aria-label="More"
          aria-owns={open ? "long-menu" : undefined}
          aria-haspopup="true"
          onClick={this.onClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.onClose}
        >
          <MenuItem
            component={Link}
            to={`${get(this.props, "match.url")}/edit`}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={this.props.onDelete}>Delete</MenuItem>
        </Menu>
      </>
    );
  }
}

const Navbar = React.memo(props => (
  <AppBar position="sticky">
    <Container maxWidth="md">
      <Toolbar disableGutters className={props.classes.toolbar}>
        <LongMenu {...props} />
      </Toolbar>
    </Container>
  </AppBar>
));

export default withRouter(withStyles(styles)(Navbar));
