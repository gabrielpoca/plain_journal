import React from 'react';
import moment from 'moment';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const Text = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Entry = ({ entry }) => {
  const template = document.createElement('div');
  template.innerHTML = entry.body.split('</p>')[0] + '</p>';

  return (
    <ListItem component={Link} to={`/entries/entry/${entry._id}`}>
      <ListItemText secondary={moment(entry.date).format('DD/MM/YY')}>
        <Text>{template.innerText}</Text>
      </ListItemText>
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
