import _ from 'lodash';
import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';

import Navbar from './Navbar';
import useKeyboardDetect from '../../hooks/useKeyboardDetect';
import useJournalEntry from '../../hooks/useJournalEntry';

import db from '../db';

import { getCoverFromEntry } from '../helpers';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'white',
    top: '0',
    left: '0',
    width: '100%',
    position: 'fixed',
    backgroundColor: theme.palette.background.default,
  },
});

const Header = styled.div`
  flex-basis: ${props => (props.withCover ? '300px' : '0px')};
  flex-grow: 0;
  flex-shrink: 0;
  align-self: stretch;
  width: 100%;
  position: relative;
`;

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

const Img = styled.img`
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const onDelete = async (entry, history) => {
  try {
    await db.remove(entry._id, entry._rev);
    history.push('/entries');
  } catch (e) {
    console.error(e);
  }
};

const EntryPage = ({ classes, history, match }) => {
  const entry = useJournalEntry(_.get(match, 'params.id'));

  if (!entry)
    return (
      <div className={classes.root}>
        <Navbar onDelete={() => null} />
      </div>
    );

  return (
    <div className={classes.root}>
      <Navbar onDelete={() => onDelete(entry, history)} />
      <Header withCover={!!entry._attachments}>
        {entry._attachments && <Img src={getCoverFromEntry(entry)} />}
      </Header>
      <Title>{moment(entry.date).format('DD/MM/YY')}</Title>
      <Body dangerouslySetInnerHTML={{ __html: entry.body }} />
    </div>
  );
};

export default withStyles(styles)(EntryPage);
