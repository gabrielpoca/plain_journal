import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Root = styled(Link)`
  text-decoration: none;
`;

const Entry = ({ entry }) => {
  const template = document.createElement('div');
  template.innerHTML = entry.body;

  return (
    <ListItem component={Link} to={`/entries/entry/${entry._id}`}>
      <ListItemText
        primary={template.innerText}
        secondary={moment(entry.date).format('DD/MM/YY')}
      />
    </ListItem>
  );
};

const EntriesList = props => (
  <List>
    {props.entries.map(entry => (
      <Entry key={entry._id} entry={entry} />
    ))}
  </List>
);

export default EntriesList;
