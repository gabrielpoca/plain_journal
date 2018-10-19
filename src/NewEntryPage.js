import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';

import Fab from './Fab';
import Navbar from './Navbar';
import Editor from './components/Editor';
import CoverPicker from './components/CoverPicker';

import entries from './entries';

import 'quill/dist/quill.core.css';

const newID = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

const Root = styled.div`
  height: 100%;
  overflow: hidden;

  .DateInput_input__focused {
    border: 0;
  }
`;

const DateInput = styled.input`
  border: 0;
  width: 100%;
  height: 40px;
  color: inherit;
  font-size: 16px;
  font-family: inherit;
  padding: 8px 16px;
  background: white;
`;

class NewEntryPage extends React.Component {
  state = {
    body: '',
    cover: null,
    date: moment(),
    bodyFocus: false,
    keyboardOpen: false,
    disabled: false
  };

  constructor() {
    super();
    this.root = React.createRef();
  }

  componentDidMount() {
    this.baseWindowHeight = window.innerHeight;
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    if (window.innerHeight === this.baseWindowHeight) {
      this.setState({ keyboardOpen: false });
    } else {
      this.setState({ keyboardOpen: true });
    }
  };

  onSave = async () => {
    if (!this.state.body || !this.state.date) return false;

    this.setState({ disabled: true });

    try {
      const changes = {
        _id: newID(),
        date: this.state.date.toDate(),
        body: this.state.body
      };

      if (this.state.cover) {
        changes._attachments = {
          cover: {
            content_type: this.state.coverType,
            data: this.state.cover.replace(
              `data:${this.state.coverType};base64,`,
              ''
            )
          }
        };
      }

      await entries.put(changes);

      this.props.history.push('/');
    } catch (e) {
      console.error(e);
      this.setState({ disabled: false });
    }
  };

  render() {
    return (
      <Root ref={this.root}>
        <Navbar withBackButton />
        <React.Fragment>
          <CoverPicker
            onChange={({ file, type }) =>
              this.setState({ cover: file, coverType: type })
            }
            onPreview={file => this.setState({ coverPreview: file })}
            disabled={this.state.disabled}
            {...this.state}
          />
          <DateInput
            disabled={this.state.disabled}
            type="date"
            max={moment().format('YYYY-MM-DD')}
            value={this.state.date.format('YYYY-MM-DD')}
            onChange={event =>
              this.setState({
                date: moment(event.target.value, 'YYYY-MM-DD')
              })
            }
          />
        </React.Fragment>
        <Editor
          theme="snow"
          disabled={this.state.disabled}
          value={this.state.body}
          expanded={this.state.bodyFocus && this.state.keyboardOpen}
          onChange={body => this.setState({ body })}
          onFocus={() => this.setState({ bodyFocus: true })}
          onBlur={() => this.setState({ bodyFocus: false })}
          onQuill={quill => (this.quill = quill)}
          modules={{
            toolbar: [
              [{ cover: [2, false] }],
              ['bold', 'italic'],
              ['link', 'image']
            ]
          }}
        />
        <Fab as="button" onClick={this.onSave} disabled={this.state.disabled} />
      </Root>
    );
  }
}

export default NewEntryPage;
