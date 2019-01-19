import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

import EntriesList from './EntriesList';
import Navbar from './Navbar';

import db from '../db';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class EntriesContainer extends React.Component {
  constructor() {
    super();
    this.state = { entries: [], searchQuery: '', onSearch: this.onSearch };
  }

  componentWillMount() {
    this.sub = db
      .changes({
        since: 'now',
        live: true,
      })
      .on('change', this.update);
    this.update();
  }

  componentWillUnmount() {
    this.sub.cancel();
  }

  update = _.throttle(
    async () => {
      let newEntries = [];

      if (!this.state.searchQuery) {
        newEntries = (await db.find({
          selector: {},
          sort: [{ date: 'desc' }],
        })).docs;
      } else {
        newEntries = (await db.search({
          query: this.state.searchQuery,
          fields: ['body'],
          mm: '50%',
          sort: [{ date: 'desc' }],
          include_docs: true,
        })).rows.map(r => r.doc);
      }

      this.setState({ entries: newEntries });
    },
    { wait: 100, trailing: true }
  );

  onSearch = event => {
    this.setState(
      { searchQuery: _.get(event.target, 'value', '') },
      this.update
    );
  };

  render() {
    return this.props.children(this.state);
  }
}

const EntriesPage = ({ classes, match }) => (
  <EntriesContainer>
    {({ entries, onSearch, searchQuery }) => (
      <>
        <Navbar onSearch={onSearch} searchQuery={searchQuery} />
        <React.Fragment>
          {<EntriesList entries={entries} />}
          <Fab
            aria-label="Add"
            className={classes.fab}
            color="primary"
            component={Link}
            to={`${match.url}/new`}
          >
            <AddIcon />
          </Fab>
        </React.Fragment>
      </>
    )}
  </EntriesContainer>
);

export default withStyles(styles)(EntriesPage);