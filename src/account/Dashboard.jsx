import React, { useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import UserContext from "./UserContext";

function Dashboard(props) {
  const { loading, user, signOut } = useContext(UserContext);

  if (loading) return null;

  if (!user) return <Redirect to="/account/sign_up" />;

  const email = user.email;

  return (
    <>
      <AppBar className={props.classes.appBar}>
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
      <div className={props.classes.view}>
        {email && (
          <p>
            You are logged in with <em>{email}</em>
          </p>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={signOut}
          className={props.classes.button}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}

export default Dashboard;
