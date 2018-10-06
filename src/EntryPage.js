import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import entries from './entries';

import Navbar from './Navbar';
import { getCoverFromEntry } from './helpers';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  flex-basis: 300px;
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

const DeleteButton = styled.button`
  height: 32px;
  background: transparent;
  border: 0;
  color: white;
  font-size: 16px;
`;

class EntryPage extends React.Component {
  state = { entry: null };

  componentWillMount() {
    this.updateEntry();
  }

  componentDidUpdate() {
    this.updateEntry();
  }

  updateEntry = async () => {
    if (_.get(this.state.entry, '_id', false) === this.props.match.params.id)
      return;

    const doc = await entries.get(this.props.match.params.id, {
      attachments: true
    });

    this.setState({ entry: doc });
  };

  onDelete = async () => {
    console.log(this.state);
    entries.remove(this.state.entry._id);
    this.props.history.push('/');
  };

  render() {
    if (!this.state.entry) return null;

    return (
      <Root>
        <Navbar light withBackButton />
        <Header>
          <Img src={getCoverFromEntry(this.state.entry)} />
        </Header>
        <Title>{moment(this.state.entry.date).format('DD/MM/YY')}</Title>
        <Body dangerouslySetInnerHTML={{ __html: this.state.entry.body }} />
      </Root>
    );
  }
}

export default EntryPage;
