import React from "react";
import { useState } from "react";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import makeStyles from "@material-ui/styles/makeStyles";
import Container from "@material-ui/core/Container";
import { MuiThemeProvider } from "@material-ui/core/styles";

import Editor from "./Editor";
import { theme } from "../../theme";

import useKeyboardDetect from "../../hooks/useKeyboardDetect";

const useStyles = makeStyles(theme => ({
  root: {
    height: "calc(100% - 56px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  date: {
    maxWidth: 200,
    paddingTop: theme.spacing(2)
  }
}));

const EntryForm = props => {
  const classes = useStyles();
  const [ref] = useState(React.createRef());
  const [bodyFocus, setBodyFocus] = useState(false);
  const keyboardOpen = useKeyboardDetect();

  const { disabled, body, date } = props;
  const expanded = bodyFocus && keyboardOpen;

  return (
    <Container className={classes.root} ref={ref} maxWidth="md">
      {!expanded && (
        <div className={classes.date}>
          <MuiThemeProvider
            theme={{
              ...theme,
              palette: {
                ...theme.palette,
                background: { ...theme.palette.background, paper: "#333" }
              }
            }}
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                fullWidth
                disabled={disabled}
                disableFuture
                value={date}
                onChange={date => props.onChange({ date })}
              />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </div>
      )}
      <Editor
        theme="snow"
        disabled={disabled}
        value={body}
        expanded={expanded}
        onChange={newBody => props.onChange({ body: newBody })}
        onFocus={() => setBodyFocus(true)}
        onBlur={() => setBodyFocus(false)}
        modules={{
          toolbar: [
            [{ cover: [2, false] }],
            ["bold", "italic"],
            ["link", "image"]
          ]
        }}
      />
    </Container>
  );
};

export default EntryForm;
