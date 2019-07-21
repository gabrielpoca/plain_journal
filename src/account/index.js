import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "./Dashboard";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/`} component={Dashboard} />
    <Route exact path={`${match.path}/sign_in`} component={SignIn} />
    <Route path={`${match.path}/sign_up`} component={SignUp} />
  </Switch>
);
