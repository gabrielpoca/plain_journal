import _ from 'lodash';
import 'react-dates/initialize';
import React from 'react';
import ReactDropzone from 'react-dropzone';
import styled from 'styled-components';
import moment from 'moment';

import placeholderImg from './placeholder-image.jpg';
import Fab from './Fab';
import Navbar from './Navbar';
import Editor from './components/Editor';

import entries from './entries';

import 'quill/dist/quill.core.css';
import 'react-dates/lib/css/_datepicker.css';

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

const Dropzone = styled(ReactDropzone)`
  background-position: center 30px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${props => props.cover});
  height: 300px;
  position: relative;
`;

const CoverPicker = props => {
  const cover = _.get(props, 'cover.preview', placeholderImg);

  return (
    <Dropzone
      disabled={props.disabled}
      acceptedFiles="image/*"
      capture={true}
      onDrop={props.onChange}
      cover={cover}
    />
  );
};

const DateInput = styled.input`
  border: 0;
  width: 100%;
  height: 4jpx;
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
    if (!this.state.body || !this.state.date || !this.state.cover) return false;

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
            type: this.state.cover.type,
            data: this.state.cover
          }
        };
      }

      await entries.put(changes);

      this.props.history.push('/');
    } catch (e) {
      this.setState({ disabled: false });
    }
  };

  render() {
    return (
      <Root innerRef={this.root}>
        <Navbar withBackButton />
        <React.Fragment>
          <CoverPicker
            onChange={files => this.setState({ cover: files[0] })}
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
        <Fab as="button" onClick={this.onSave} disabled={this.state.disabled}>
          Save
        </Fab>
      </Root>
    );
  }
}

export default NewEntryPage;
