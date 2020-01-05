import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
  title: {
    fontFamily: "Merriweather",
    fontSize: 20
  }
}));

export function NavbarTitle() {
  const classes = useStyles();
  return <h1 className={classes.title}>Journal</h1>;
}
