import React, { useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import { UserContext } from "../core/User";
import { useStyles } from "./styles";

function Dashboard() {
  const classes = useStyles();
  const { user, signOut } = useContext(UserContext);

  if (!user) return <Redirect to="/account/sign_up" />;

  const { email } = user;

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            component={Link}
            to="/"
            color="inherit"
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.view}>
        <Box mb={3}>
          <p>
            You are logged in with <em>{email}</em>
          </p>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={signOut}
          className={classes.button}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}

export default Dashboard;
