import React from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import Editor from './Editor';
import CoverPicker from './CoverPicker';

const Root = styled.div`
  height: calc(100% - 56px);
  overflow: hidden;

  .DateInput_input__focused {
    border: 0;
  }
`;

const styles = theme => ({
  date: {
    border: 0,
    width: '100%',
    color: 'inherit',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
});

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
    const { disabled, cover, coverPreview, body, date, classes } = this.props;

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
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.date}>
              <DatePicker
                disabled={disabled}
                disableFuture
                value={date}
                autoOk
                onChange={date => this.props.onChange({ date })}
              />
            </div>
          </MuiPickersUtilsProvider>
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

export default withStyles(styles)(NewEntryPage);
