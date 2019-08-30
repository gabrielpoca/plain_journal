import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { initializeFirebase } from "./notifications";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#151515",
      paper: "#151515"
    },
    primary: {
      main: "#151515",
      dark: "#000"
    },
    secondary: {
      main: "#FFF"
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
