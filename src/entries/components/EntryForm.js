import React from 'react';
import { useState } from 'react';
import styled from 'styled-components/macro';
import moment from 'moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import Editor from './Editor';
import CoverPicker from './CoverPicker';

import useKeyboardDetect from '../../hooks/useKeyboardDetect';

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

const NewEntryPage = props => {
  const [ref] = useState(React.createRef());
  const [bodyFocus, setBodyFocus] = useState(false);
  const keyboardOpen = useKeyboardDetect();

  const { disabled, cover, coverPreview, body, date, classes } = props;

  return (
    <Root ref={ref}>
      <React.Fragment>
        <CoverPicker
          onChange={({ file, type }) =>
            props.onChange({ cover: file, coverType: type })
          }
          onPreview={file => props.onChange({ coverPreview: file })}
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
              onChange={date => props.onChange({ date })}
            />
          </div>
        </MuiPickersUtilsProvider>
      </React.Fragment>
      <Editor
        theme="snow"
        disabled={disabled}
        value={body}
        expanded={bodyFocus && keyboardOpen}
        onChange={newBody => props.onChange({ body: newBody })}
        onFocus={() => setBodyFocus(true)}
        onBlur={() => setBodyFocus(false)}
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
};

export default withStyles(styles)(NewEntryPage);
