import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

import Background from "../../components/Background";
import EntriesList from "./EntriesList";
import Navbar from "./Navbar";

import { all, onChange, offChange } from "../db";

const styles = theme => ({
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
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3
  }
});

function useEntries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const update = async () => {
      const entries = await all();
      setEntries(entries);
    };

    update();

    onChange(update);

    return () => offChange(update);
  }, []);

  return entries;
}

const EntriesPage = ({ classes, match }) => {
  const entries = useEntries();

  return (
    <Background>
      <div className={classes.root}>
        <Navbar />
        <React.Fragment>
          {<EntriesList entries={entries} />}
          <Fab
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

export default withStyles(styles)(EntriesPage);
