import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import { FORM_ERROR } from "final-form";
import localForage from "localforage";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import { withStyles } from "@material-ui/core/styles";

import Session from "../core/Session";
import UserForm from "../components/UserForm";
import MyLink from "@material-ui/core/Link";

function useSession() {
  const [loggedIn, setLoggedIn] = useState(undefined);

  useEffect(() => {
    (async () => {
      const update = () => setLoggedIn(Session.valid());
      Session.onChange(update);
      return () => Session.off(update);
    })();
  });

  return loggedIn;
}

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  link: {
    display: "block",
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2
  },
  view: {
    margin: theme.spacing.unit
  },
  button: {}
});

const validate = values => {
  const errors = {};

  if (!values.email) errors.email = "Required";
  if (!values.password) errors.password = "Required";

  return errors;
};

function Dashboard(props) {
  const [email, setEmail] = useState();

  const signOut = async () => {
    console.log("sign out");
    await Session.signOut();
  };

  useEffect(() => {
    (async () => {
      setEmail(await localForage.getItem("email"));
    })();
  });

  if (!Session.valid()) return <Redirect to="/account/sign_in" />;

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

function SignIn(props) {
  const onSubmit = async values => {
    try {
      return await Session.signIn(values.email, values.password);
    } catch (e) {
      let message = _.get(e, "response.data.reason");

      if (!message) message = e.message;

      return { [FORM_ERROR]: message };
    }
  };

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
      <UserForm
        validate={validate}
        onSubmit={onSubmit}
        buttonText="Sign In"
        formTitle="Sign In"
      />
      <MyLink
        className={props.classes.link}
        component={Link}
        to="/account/sign_up"
      >
        Sign Up instead
      </MyLink>
    </>
  );
}

function SignUp(props) {
  const onSubmit = async values => {
    try {
      return await Session.signUp(values.email, values.password);
    } catch (e) {
      let message = _.get(e, "response.data.reason");

      if (!message) message = e.message;

      return { [FORM_ERROR]: message };
    }
  };

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
      <UserForm
        validate={validate}
        onSubmit={onSubmit}
        buttonText="Sign Up"
        formTitle="Sign Up"
      />
      <MyLink component={Link} to="/account/sign_in">
        Sign In instead
      </MyLink>
    </>
  );
}

export default ({ match }) => (
  <Switch>
    <Route
      exact
      path={`${match.path}/`}
      component={withStyles(styles)(Dashboard)}
    />
    <Route
      exact
      path={`${match.path}/sign_in`}
      component={withStyles(styles)(SignIn)}
    />
    <Route
      path={`${match.path}/sign_up`}
      component={withStyles(styles)(SignUp)}
    />
  </Switch>
);
