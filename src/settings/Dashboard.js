import React from "react";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Navbar from "./Navbar";
import { Reminders } from "./Reminders";
import { Geolocation } from "./Geolocation";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(4)
  }
}));

export function Dashboard() {
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
      </Container>
    </>
  );
}
