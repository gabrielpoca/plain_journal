import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

import Background from "../../components/Background";
import EntriesList from "./EntriesList";
import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
    overflow: "scroll"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(3)
  }
}));

const EntriesPage = ({ match }) => {
  const { db } = useContext(DBContext);
  const entries = db.entries.useEntries();
  const classes = useStyles();

  return (
    <Background>
      <div className={classes.root}>
        <Navbar />
        <React.Fragment>
          {<EntriesList entries={entries} />}
          <Fab
            size="large"
            aria-label="Add"
            className={classes.fab}
            color="secondary"
            component={Link}
            to={`${match.url}/new`}
          >
            <AddIcon />
          </Fab>
        </React.Fragment>
      </div>
    </Background>
  );
};

export default EntriesPage;
