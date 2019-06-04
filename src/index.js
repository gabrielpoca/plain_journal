import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import "./entries/db";
import "./core/Sync";
import "./core/Session";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { initializeFirebase } from "./notifications";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#62727b",
      dark: "#607d8b",
      main: "#37474f"
    },
    secondary: {
      light: "#718792",
      dark: "#1c313a",
      main: "#455a64"
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById("root")
);

initializeFirebase();
registerServiceWorker();
