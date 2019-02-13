import _ from 'lodash';
import React from 'react';
import moment from 'moment';

import EntryForm from '../components/EntryForm';
import Navbar from './Navbar';

import db from '../../db';
import { getCoverFromEntry } from '../helpers';

class EditEntryPage extends React.Component {
  state = {
    _id: null,
    _rev: null,
    body: null,
    cover: null,
    coverType: null,
    coverPreview: null,
    date: null,
    disabled: false,
  };

  componentWillMount() {
    this.updateEntry();
  }

  updateEntry = async () => {
    if (_.get(this.state.entry, '_id', false) === this.props.match.params.id)
      return;

    const doc = await db.get(this.props.match.params.id, {
      attachments: true,
    });

    this.setState({
      doc: doc,
      body: doc.body,
      date: moment(doc.date),
    });

    if (doc._attachments) {
      const coverPreview = getCoverFromEntry(doc);
      this.setState({ coverPreview });
    }
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
