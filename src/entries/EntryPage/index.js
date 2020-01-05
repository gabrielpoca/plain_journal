import get from "lodash/get";
import React, { useContext } from "react";
import moment from "moment";
import makeStyles from "@material-ui/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useObservable } from "rxjs-hooks";
import { map } from "rxjs/operators";

import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "white",
    top: "0",
    left: "0",
    width: "100%",
    position: "fixed",
    backgroundColor: theme.palette.background.default,
    overflow: "scroll"
  },
  date: {
    marginTop: theme.spacing(4)
  },
  body: {
    flex: 1,
    alignSelf: "stretch"
  }
}));

const useEntry = (db, id) => {
  const { entry } = useObservable(
    () => db.entries.findOne(id).$.pipe(map(found => ({ entry: found }))),
    { entry: undefined },
    [id]
  );

  return entry;
};

const onDelete = async (db, entry, history) => {
  try {
    await db.entries.findOne(entry.id).remove();
    history.push("/entries");
  } catch (e) {
    console.error(e);
  }
};

const EntryPage = ({ history, match }) => {
  const { db } = useContext(DBContext);
  const entry = useEntry(db, get(match, "params.id"));
  const classes = useStyles();

  if (!entry)
    return (
      <div className={classes.root}>
        <Navbar onDelete={() => null} />
      </div>
    );

  return (
    <div className={classes.root}>
      <Navbar onDelete={() => onDelete(db, entry, history)} />
      <Container maxWidth="md">
        <Typography className={classes.date}>
          {moment(entry.date).format("DD/MM/YY")}
        </Typography>
        <div
          className={classes.body}
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      </Container>
    </div>
  );
};

export default EntryPage;
