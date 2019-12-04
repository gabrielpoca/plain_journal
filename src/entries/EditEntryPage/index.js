import _ from "lodash";
import React from "react";
import moment from "moment";

import EntryForm from "../components/EntryForm";
import Navbar from "./Navbar";
import { DBContext } from "../../core/Database";

class EditEntryPage extends React.Component {
  static contextType = DBContext;

  state = {
    id: null,
    body: null,
    date: null,
    disabled: false
  };

  componentDidMount() {
    this.updateEntry();
  }

  updateEntry = async () => {
    if (_.get(this.state.entry, "id", false) === this.props.match.params.id)
      return;

    const doc = await this.context.db.entries
      .findOne(this.props.match.params.id)
      .exec();

    this.setState({
      doc: doc,
      body: doc.body,
      date: moment(doc.date)
    });
  };

  onSave = async () => {
    if (!this.state.body || !this.state.date) return false;

    try {
      this.setState({ disabled: true });
      await this.state.doc.update({
        $set: {
          body: this.state.body,
          date: this.state.date.format()
        }
      });
      this.props.history.push("/entries");
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
