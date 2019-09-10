import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

const styles = {
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
};

const Entry = withStyles(styles)(({ entry, classes }) => {
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
});

const listStyles = theme => ({
  root: {
    paddingBottom: theme.spacing(7)
  }
});

const EntriesList = withStyles(listStyles)(props => (
  <List className={props.classes.root}>
    {props.entries.map(entry => (
      <Entry key={entry.id} entry={entry} />
    ))}
  </List>
));

export default EntriesList;
