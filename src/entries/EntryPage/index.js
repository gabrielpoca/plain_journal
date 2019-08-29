import _ from "lodash";
import React, { useContext } from "react";
import styled from "styled-components/macro";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

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
  }
}));

const Body = styled.div`
  flex: 1;
  align-self: stretch;
  padding: 0 16px;
`;

const Title = styled.h1`
  margin-top: 32px;
  font-size: 16px;
  line-height: 24px;
  padding: 0 16px;
`;

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
      <Title>{moment(entry.date).format("DD/MM/YY")}</Title>
      <Body dangerouslySetInnerHTML={{ __html: entry.body }} />
    </div>
  );
};

export default EntryPage;
