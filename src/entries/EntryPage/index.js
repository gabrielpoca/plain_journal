import _ from "lodash";
import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";

import Navbar from "./Navbar";

import { get, remove } from "../db";

const styles = theme => ({
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
});

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

const onDelete = async (entry, history) => {
  try {
    await remove(entry);
    history.push("/entries");
  } catch (e) {
    console.error(e);
  }
};

function useJournalEntry(id) {
  const [entry, setEntry] = useState(null);

  useEffect(
    () => {
      (async () => {
        if (!id) return;

        const doc = await get(id);

        setEntry(doc);
      })();
    },
    [id]
  );

  return entry;
}

const EntryPage = ({ classes, history, match }) => {
  const entry = useJournalEntry(_.get(match, "params.id"));

  if (!entry)
    return (
      <div className={classes.root}>
        <Navbar onDelete={() => null} />
      </div>
    );

  return (
    <div className={classes.root}>
      <Navbar onDelete={() => onDelete(entry, history)} />
      <Title>{moment(entry.date).format("DD/MM/YY")}</Title>
      <Body dangerouslySetInnerHTML={{ __html: entry.body }} />
    </div>
  );
};

export default withStyles(styles)(EntryPage);
