import React from "react";
import { Link } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  list: {
    width: 200
  }
});

class SidebarMenu extends React.Component {
  state = { open: false };

  onToggle = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <>
        <IconButton onClick={this.onToggle} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Drawer open={this.state.open} onClose={this.onToggle}>
          <List className={this.props.classes.list}>
            <ListItem>
              <Typography variant="h5" inline>
                Journal
              </Typography>
            </ListItem>
            <Divider />
            <ListItem component={Link} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem component={Link} to="/account">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItem>
          </List>
        </Drawer>
      </>
    );
  }
}

export default withStyles(styles)(SidebarMenu);
