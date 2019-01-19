import React from 'react';
import moment from 'moment';

import EntryForm from '../components/EntryForm';
import Navbar from './Navbar';

import db from '../db';

const newID = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

class NewEntryPage extends React.Component {
  state = {
    body: '',
    cover: null,
    coverPreview: null,
    date: moment(),
    disabled: false,
  };

  onSave = async () => {
    if (!this.state.body || !this.state.date) return false;

    this.setState({ disabled: true });

    try {
      const changes = {
        _id: newID(),
        date: this.state.date.toDate(),
        body: this.state.body,
      };

      if (this.state.cover) {
        changes._attachments = {
          cover: {
            content_type: this.state.coverType,
            data: this.state.cover.replace(
              `data:${this.state.coverType};base64,`,
              ''
            ),
          },
        };
      }

      await db.put(changes);

      this.props.history.push('/entries');
    } catch (e) {
      console.error(e);
      this.setState({ disabled: false });
    }
  };

  render() {
    return (
      <>
        <Navbar onSave={this.onSave} />
        <EntryForm onChange={change => this.setState(change)} {...this.state} />
      </>
    );
  }
}

export default NewEntryPage;
