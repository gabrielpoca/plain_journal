import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';

import Editor from './Editor';
import CoverPicker from './CoverPicker';

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
    bodyFocus: false,
    keyboardOpen: false,
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

  render() {
    const { disabled, cover, coverPreview, body, date } = this.props;

    return (
      <Root ref={this.root}>
        <React.Fragment>
          <CoverPicker
            onChange={({ file, type }) =>
              this.props.onChange({ cover: file, coverType: type })
            }
            onPreview={file => this.props.onChange({ coverPreview: file })}
            disabled={disabled}
            cover={cover}
            coverPreview={coverPreview}
          />
          <DateInput
            disabled={disabled}
            type="date"
            max={moment().format('YYYY-MM-DD')}
            value={date.format('YYYY-MM-DD')}
            onChange={event =>
              this.props.onChange({
                date: moment(event.target.value, 'YYYY-MM-DD'),
              })
            }
          />
        </React.Fragment>
        <Editor
          theme="snow"
          disabled={disabled}
          value={body}
          expanded={this.state.bodyFocus && this.state.keyboardOpen}
          onChange={newBody => this.props.onChange({ body: newBody })}
          onFocus={() => this.setState({ bodyFocus: true })}
          onBlur={() => this.setState({ bodyFocus: false })}
          modules={{
            toolbar: [
              [{ cover: [2, false] }],
              ['bold', 'italic'],
              ['link', 'image'],
            ],
          }}
        />
      </Root>
    );
  }
}

export default NewEntryPage;
