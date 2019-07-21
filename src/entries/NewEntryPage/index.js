import React, { useState } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

import EntryForm from "../components/EntryForm";
import Navbar from "./Navbar";

import { put } from "../db";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.default,
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0
  }
}));

function NewEntryPage(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    body: "",
    date: moment(),
    disabled: false
  });

  const onSave = async () => {
    if (!state.body || !state.date) return false;

    setState({ disabled: true });

    try {
      await put({
        date: state.date.toDate(),
        body: state.body
      });

      props.history.push("/entries");
    } catch (e) {
      console.error(e);
      setState({ disabled: false });
    }
  };

  return (
    <div className={classes.root}>
      <Navbar onSave={onSave} />
      <EntryForm
        onChange={change => setState({ ...state, ...change })}
        {...state}
      />
    </div>
  );
}

export default NewEntryPage;
