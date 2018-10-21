import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import EntriesList from './EntriesList';
import Fab from './components/Fab';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

import entries from './entries';

const Root = styled.div`
  padding-top: var(--nav-height);
`;

class EntriesContainer extends React.Component {
  constructor() {
    super();
    this.state = { entries: [], searchQuery: '', onSearch: this.onSearch };
  }

  componentWillMount() {
    this.sub = entries
      .changes({
        since: 'now',
        live: true
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
        newEntries = (await entries.find({
          selector: {},
          sort: [{ date: 'desc' }]
        })).docs;
      } else {
        newEntries = (await entries.search({
          query: this.state.searchQuery,
          fields: ['body'],
          mm: '50%',
          sort: [{ date: 'desc' }],
          include_docs: true
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

const SearchRoot = styled.div`
  width: 100%;
  padding: 16px 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 32px;
  border: none;
  font-size: 12px;
  line-height: 32px;
  height: 32px;
  font-family: inherit;
  padding: 0 16px;
  background-color: #dbe7f4;
`;

const Search = props => (
  <SearchRoot>
    <SearchInput
      placeholder="Search for a moment"
      type="text"
      value={props.value}
      onChange={props.onChange}
    />
  </SearchRoot>
);

const EntriesPage = () => (
  <Layout>
    <Root>
      <EntriesContainer>
        {({ entries, onSearch, searchQuery }) => (
          <React.Fragment>
            <Navbar />
            <Search value={searchQuery} onChange={onSearch} />
            {<EntriesList entries={entries} />}
            <Link to="/new">
              <Fab as="span" aria-label="add" />
            </Link>
          </React.Fragment>
        )}
      </EntriesContainer>
    </Root>
  </Layout>
);

export default EntriesPage;
