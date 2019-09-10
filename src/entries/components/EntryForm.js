import React from "react";
import { useState } from "react";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";

import Editor from "./Editor";

import useKeyboardDetect from "../../hooks/useKeyboardDetect";

const useStyles = makeStyles(theme => ({
  root: {
    height: "calc(100% - 56px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  date: {
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
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              disabled={disabled}
              disableFuture
              value={date}
              autoOk
              onChange={date => props.onChange({ date })}
            />
          </MuiPickersUtilsProvider>
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
