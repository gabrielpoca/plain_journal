import _ from 'lodash';
import React from 'react';
import moment from 'moment';

import EntryForm from '../components/EntryForm';
import Navbar from './Navbar';

import { get, put } from '../db';

class EditEntryPage extends React.Component {
  state = {
    id: null,
    body: null,
    date: null,
    disabled: false,
  };

  componentWillMount() {
    this.updateEntry();
  }

  updateEntry = async () => {
    if (_.get(this.state.entry, 'id', false) === this.props.match.params.id)
      return;

    const doc = await get(this.props.match.params.id);

    this.setState({
      doc: doc,
      body: doc.body,
      date: moment(doc.date),
    });
  };

  onSave = async () => {
    if (!this.state.body || !this.state.date) return false;

    try {
      this.setState({ disabled: true });
      const changes = {
        ...this.state.doc,
        date: this.state.date.toDate(),
        body: this.state.body,
      };

      await put(changes);
      this.props.history.push('/entries');
    } catch (e) {
      console.error(e);
      this.setState({ disabled: false });
    }
  };

  render() {
    if (!this.state.body) return <Navbar onSave={this.onSave} />;

    return (
      <>
        <Navbar onSave={this.onSave} />
        <EntryForm onChange={change => this.setState(change)} {...this.state} />
      </>
    );
  }
}

export default EditEntryPage;
