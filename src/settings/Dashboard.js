import React from "react";

import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Navbar from "./Navbar";
import { Reminders } from "./Reminders";
import { Geolocation } from "./Geolocation";
import { Data } from "./Data";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(4)
  }
}));

export function Dashboard(props) {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <div className={classes.root}>
          <Reminders />
        </div>
        <div className={classes.root}>
          <Geolocation />
        </div>
        <div className={classes.root}>
          <Data {...props} />
        </div>
      </Container>
    </>
  );
}
