import _ from 'lodash';
import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';

import trash from './trash-can.svg';
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
  background-image: url(${trash});
  background-size: 32px;
  background-repeat: no-repeat;
  background-position: center;
  width: 40px;
  height: 40px;
  border: 0;
`;

class EntryPage extends React.Component {
  state = { entry: null, el: React.createRef() };

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
      attachments: true,
    });

    this.setState({ entry: doc });
  };

  onDelete = async () => {
    try {
      await entries.remove(this.state.entry._id, this.state.entry._rev);
      this.props.history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    if (!this.state.entry) return null;

    return (
      <Root>
        <Header>
          <Observer root={this.state.el.current}>
            {({ inView, ref }) => (
              <React.Fragment>
                <Navbar light={inView} withBackButton>
                  <DeleteButton onClick={this.onDelete} />
                </Navbar>
                <Img ref={ref} src={getCoverFromEntry(this.state.entry)} />
              </React.Fragment>
            )}
          </Observer>
        </Header>
        <Title>{moment(this.state.entry.date).format('DD/MM/YY')}</Title>
        <Body dangerouslySetInnerHTML={{ __html: this.state.entry.body }} />
      </Root>
    );
  }
}

class Observer extends React.Component {
  constructor() {
    super();

    this.state = {
      inView: true,
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio < 0.3) this.setState({ inView: false });
          else this.setState({ inView: true });
        });
      },
      {
        root: this.props.root,
        rootMargin: '0px',
        threshold: 0.3,
      }
    );

    this.observer.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    return this.props.children({ ...this.state, ref: this.ref });
  }
}

export default EntryPage;
