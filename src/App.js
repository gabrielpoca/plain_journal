import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch, Redirect } from "react-router-dom";

import EntriesRouter from "./entries/Router";
import SettingsRouter from "./settings/Router";
import AccountRouter from "./account";
import { UserContextProvider } from "./core/User";
import { DBContextProvider } from "./core/Database";
import KeyValueStorage from "./KeyValueStorage";

import "./App.css";

class App extends Component {
  render() {
    return (
      <UserContextProvider>
        <CssBaseline />
        <DBContextProvider>
          <KeyValueStorage>
            <Switch>
              <Route path="/entries" component={EntriesRouter} />
              <Route path="/settings" component={SettingsRouter} />
              <Route path="/account" component={AccountRouter} />
              <Route render={() => <Redirect to="/entries" />} />
            </Switch>
          </KeyValueStorage>
        </DBContextProvider>
      </UserContextProvider>
    );
  }
}

export default App;
