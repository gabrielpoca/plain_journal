import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const theme = createMuiTheme({
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
