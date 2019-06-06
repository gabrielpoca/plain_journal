import React from "react";
import { useState } from "react";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { makeStyles } from "@material-ui/styles";

import Editor from "./Editor";

import useKeyboardDetect from "../../hooks/useKeyboardDetect";

const useStyles = makeStyles(theme => ({
  root: {
    height: "calc(100% - 56px)",
    overflow: "hidden"
  },
  date: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1)
  }
}));

const EntryForm = props => {
  const classes = useStyles();
  const [ref] = useState(React.createRef());
  const [bodyFocus, setBodyFocus] = useState(false);
  const keyboardOpen = useKeyboardDetect();

  const { disabled, body, date } = props;

  return (
    <div className={classes.root} ref={ref}>
      <div className={classes.date}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className={classes.date}>
            <DatePicker
              disabled={disabled}
              disableFuture
              value={date}
              autoOk
              onChange={date => props.onChange({ date })}
            />
          </div>
        </MuiPickersUtilsProvider>
      </div>
      <Editor
        theme="snow"
        disabled={disabled}
        value={body}
        expanded={bodyFocus && keyboardOpen}
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
    </div>
  );
};

export default EntryForm;
