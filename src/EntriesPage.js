import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import EntriesList from './EntriesList';
import Fab from './Fab';
import Navbar from './Navbar';

import entries from './entries';

class EntriesContainer extends React.Component {
  state = { entries: [] };

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

  update = async () => {
    const newEntries = (await entries.allDocs({
      include_docs: true,
      attachments: true
    })).rows.map(row => row.doc);
    this.setState({ entries: newEntries });
  };

  render() {
    return this.props.children(this.state);
  }
}

const Root = styled.div`
  padding-top: 80px;
`;

const EntriesPage = () => (
  <Root>
    <Navbar />
    <EntriesContainer>
      {({ entries }) => <EntriesList entries={entries} />}
    </EntriesContainer>
    <Link to="/new">
      <Fab as="span">Add</Fab>
    </Link>
  </Root>
);

export default EntriesPage;
