import _ from "lodash";
import React, { useContext } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

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
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  body: {
    flex: 1,
    alignSelf: "stretch",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

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
  const entry = db.entries.useEntry(_.get(match, "params.id"));
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
