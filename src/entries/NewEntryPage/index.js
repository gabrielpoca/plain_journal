import React from 'react';
import moment from 'moment';

import EntryForm from '../components/EntryForm';
import Navbar from './Navbar';
import { newID } from '../../utils';

import db from '../db';

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
