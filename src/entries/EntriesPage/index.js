import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import EntriesList from "./EntriesList";
import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";
import { SearchContext } from "../../core/Search";

import { BehaviorSubject } from "rxjs";
import { interval } from "rxjs";
import { debounce, tap } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";

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

const quer$ = new BehaviorSubject("");

const EntriesPage = ({ match }) => {
  const classes = useStyles();
  const { db } = useContext(DBContext);
  const { doSearch, res, enabled } = useContext(SearchContext);
  const q = useObservable(() => quer$);
  const debouncedQuery$ = useObservable(() =>
    quer$.pipe(debounce(() => interval(300))).pipe(tap(q => q && doSearch(q)))
  );

  const entries = db.entries.useSearchEntries(debouncedQuery$, res);

  return (
    <React.Fragment>
      <Navbar />
      <Container className={classes.root} maxWidth="md">
        <EntriesList
          showSearch={enabled}
          entries={entries}
          q={q}
          onSearch={value => quer$.next(value)}
        />
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
