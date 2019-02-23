import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

import BottomNavbar from '../../components/BottomNavbar';
import Background from '../../components/Background';
import EntriesList from './EntriesList';
import Navbar from './Navbar';

import { db, all } from '../db';

const styles = theme => ({
  root: {
    // height: '100%'
    height: '100%',
    //zIndex: 1501,
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    overflow: 'scroll',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 3,
  },
});

function useEntries() {
  const [entries, setEntries] = useState([]);

  const update = async e => {
    const entries = await all();
    setEntries(_.orderBy(entries, 'date', 'desc'));
  };

  useEffect(() => {
    const sub = db
      .changes({
        since: 'now',
        live: true,
      })
      .on('change', update);
    update();
    return () => sub.cancel();
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
        <BottomNavbar />
      </div>
    </Background>
  );
};

export default withStyles(styles)(EntriesPage);
