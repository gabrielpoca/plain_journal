import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EntriesRouter from "./entries/Router";
import SettingsRouter from "./settings/Router";
import AccountRouter from "./account";
import { SearchContextProvider } from "./entries/Search";
import { UserContextProvider } from "./core/User";
import { DBContextProvider } from "./core/Database";
import { GeolocationProvider } from "./core/Geolocation";

import "./App.css";

class App extends Component {
  render() {
    return (
      <UserContextProvider>
        <ToastContainer
          hideProgressBar
          position={toast.POSITION.BOTTOM_CENTER}
          newestOnTop
        />
        <CssBaseline />
        <DBContextProvider>
          <SearchContextProvider>
            <GeolocationProvider>
              <Switch>
                <Route path="/entries" component={EntriesRouter} />
                <Route path="/settings" component={SettingsRouter} />
                <Route path="/account" component={AccountRouter} />
                <Route render={() => <Redirect to="/entries" />} />
              </Switch>
            </GeolocationProvider>
          </SearchContextProvider>
        </DBContextProvider>
      </UserContextProvider>
    );
  }
}

export default App;
