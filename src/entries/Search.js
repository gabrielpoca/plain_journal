import _ from 'lodash';
import React from 'react';

import entries from './entries';

const SearchContext = React.createContext();

class Provider extends React.PureComponent {
  constructor() {
    super();
    this.state = { entries: [], searchQuery: '', onSearch: this.onSearch };
  }

  componentWillMount() {
    this.sub = entries
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
        newEntries = (await entries.find({
          selector: {},
          sort: [{ date: 'desc' }],
        })).docs;
      } else {
        newEntries = (await entries.search({
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
    return (
      <SearchContext.Provider value={this.state}>
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}

export const SearchConsumer = SearchContext.Consumer;
export default Provider;
