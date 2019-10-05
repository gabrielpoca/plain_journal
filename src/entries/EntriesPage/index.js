import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import EntriesList from "./EntriesList";
import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";
import { SearchContext } from "../../Search";

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

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

const EntriesPage = ({ match }) => {
  const classes = useStyles();
  const { db } = useContext(DBContext);
  const { search, res } = useContext(SearchContext);
  const [q, setSearchQuery] = useState("");
  const entries = db.entries.useEntries();
  const searchEntries = db.entries.useSearchEntries(res);
  const debouncedQuery = useDebounce(q, 500);

  useEffect(() => {
    if (debouncedQuery) search(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <React.Fragment>
      <Navbar />
      <Container className={classes.root} maxWidth="md">
        {entries.length > 0 && (
          <EntriesList
            entries={q ? searchEntries : entries}
            q={q}
            onSearch={setSearchQuery}
          />
        )}
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
