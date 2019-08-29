import React, { useState } from "react";
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
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  list: {
    width: 200,
    paddingTop: theme.spacing(8)
  },
  link: {
    color: "inherit"
  }
}));

function SidebarMenu() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const onToggle = () => setOpen(!open);

  return (
    <>
      <IconButton onClick={onToggle} color="inherit" aria-label="Menu">
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={onToggle}>
        <List className={classes.list}>
          <ListItem className={classes.link} component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem className={classes.link} component={Link} to="/account">
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

export default SidebarMenu;
