import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

const useEntryStyles = makeStyles(() => ({
  root: {
    "&$selected, &$selected:hover, &$selected:focus": {
      backgroundColor: "red"
    }
  },
  selected: {},
  text: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}));

const Entry = ({ entry }) => {
  const classes = useEntryStyles();
  const template = document.createElement("div");
  template.innerHTML = entry.body.split("</p>")[0] + "</p>";

  return (
    <ListItem
      classes={{
        root: classes.root,
        selected: classes.selected,
        button: classes.button
      }}
      disableGutters
      button
      disableTouchRipple
      component={Link}
      to={`/entries/entry/${entry.id}`}
    >
      <ListItemText secondary={moment(entry.date).format("DD/MM/YY, h:mm a")}>
        <Typography className={classes.text}>{template.innerText}</Typography>
      </ListItemText>
    </ListItem>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(7)
  },
  search: {
    flex: 1
  },
  searchRoot: {
    display: "flex",
    marginTop: theme.spacing(2),
    width: "100%",
    position: "relative"
  },
  searchClear: {
    position: "absolute",
    top: "50%",
    right: 0,
    transform: "translateY(-50%)"
  }
}));

const EntriesList = ({ entries, q, onSearch, showSearch }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.searchRoot}>
        {showSearch && (
          <TextField
            margin="dense"
            placeholder="Search..."
            className={classes.search}
            value={q}
            onChange={event => onSearch(event.target.value)}
          />
        )}
        <IconButton
          className={classes.searchClear}
          onClick={() => onSearch("")}
          aria-label="Clear search"
          disableRipple
          disableFocusRipple
          size="medium"
        >
          {q && <HighlightOffOutlinedIcon />}
        </IconButton>
      </div>
      <List className={classes.root}>
        {entries.map(entry => (
          <Entry key={entry.id} entry={entry} />
        ))}
      </List>
    </>
  );
};

export default EntriesList;
