import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { map } from "rxjs/operators";

import EntriesList from "./EntriesList";
import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";
import { SearchContext } from "../Search";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    height: "100%",
    paddingTop: 50
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(3)
  }
}));

const useSearchEntries = (db, q, searchResult) => {
  const [res, setRes] = useState([]);

  useEffect(() => {
    let query = null;

    if (q) {
      query = db.entries.find({
        id: {
          $in: searchResult.map(r => r.ref)
        }
      });
    } else {
      query = db.entries.find();
    }

    const sub = query
      .sort("date")
      .$.pipe(map(val => val.reverse()))
      .subscribe(newRes => setRes(newRes));

    return () => {
      sub.unsubscribe();
    };
  }, [q, searchResult]);

  return res;
};

const EntriesPage = ({ match }) => {
  const classes = useStyles();
  const { db } = useContext(DBContext);
  const { res, enabled, q, debouncedQuery, setQuery } = useContext(
    SearchContext
  );

  const entries = useSearchEntries(db, debouncedQuery, res);

  return (
    <>
      {match ? <Navbar /> : null}
      <Container
        style={!match ? { overflow: "hidden", visibility: "hidden" } : {}}
        className={classes.root}
        maxWidth="md"
      >
        <EntriesList
          showSearch={enabled}
          entries={entries}
          q={q}
          onSearch={setQuery}
        />
        <Fab
          size="large"
          aria-label="Add"
          className={classes.fab}
          color="secondary"
          component={Link}
          to={`${match ? match.url : ""}/new`}
        >
          <AddIcon />
        </Fab>
      </Container>
    </>
  );
};

export default EntriesPage;
