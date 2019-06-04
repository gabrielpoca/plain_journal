import React from "react";
import { Route, Switch } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

import Dashboard from "./Dashboard";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

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
