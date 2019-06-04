import React, { Component } from "react";
import { withRouter } from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch, Redirect } from "react-router-dom";

import EntriesRouter from "./entries/Router";
import SettingsRouter from "./settings/Router";
import AccountRouter from "./account";
import { UserContextProvider } from "./account/UserContext";
import KeyValueStorage from "./KeyValueStorage";

import "./App.css";

class App extends Component {
  render() {
    return (
      <UserContextProvider>
        <KeyValueStorage>
          <CssBaseline />
          <Switch>
            <Route path="/entries" component={EntriesRouter} />
            <Route path="/settings" component={SettingsRouter} />
            <Route path="/account" component={AccountRouter} />
            <Route render={() => <Redirect to="/entries" />} />
          </Switch>
        </KeyValueStorage>
      </UserContextProvider>
    );
  }
}

export default withRouter(App);
