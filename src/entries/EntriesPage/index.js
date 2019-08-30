import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import EntriesList from "./EntriesList";
import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    height: "100%"
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
    <React.Fragment>
      <Navbar />
      <Container className={classes.root} maxWidth="md">
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
      </Container>
    </React.Fragment>
  );
};

export default EntriesPage;
