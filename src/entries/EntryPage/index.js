import _ from 'lodash';
import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';

import Navbar from './Navbar';

import db from '../db';

import Observer from '../components/Observer';
import { getCoverFromEntry } from '../helpers';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

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

class EntryPage extends React.Component {
  state = { entry: null, el: React.createRef() };

  componentWillMount() {
    this.updateEntry();
  }

  updateEntry = async () => {
    if (_.get(this.state.entry, '_id', false) === this.props.match.params.id)
      return;

    console.log(this.props);
    const doc = await db.get(this.props.match.params.id, {
      attachments: true,
    });

    this.setState({ entry: doc });
  };

  onDelete = async () => {
    try {
      await db.remove(this.state.entry._id, this.state.entry._rev);
      this.props.history.push('/entries');
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    if (!this.state.entry) return null;

    return (
      <Root>
        <Navbar onDelete={this.onDelete} />
        <Header withCover={!!this.state.entry._attachments}>
          {this.state.entry._attachments && (
            <Observer root={this.state.el.current}>
              {({ inView, ref }) => (
                <Img ref={ref} src={getCoverFromEntry(this.state.entry)} />
              )}
            </Observer>
          )}
        </Header>
        <Title>{moment(this.state.entry.date).format('DD/MM/YY')}</Title>
        <Body dangerouslySetInnerHTML={{ __html: this.state.entry.body }} />
      </Root>
    );
  }
}

export default EntryPage;
