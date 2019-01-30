import React from 'react';
import { Form, Field } from 'react-final-form';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  textField: {
    width: '100%',
  },
  form: {
    padding: theme.spacing.unit,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
  title: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
});

const MyTextField = withStyles(styles)(
  ({
    input: { name, onChange, value, ...restInput },
    meta,
    classes,
    ...rest
  }) => (
    <FormControl fullWidth variant="filled" className={classes.formControl}>
      <TextField
        {...rest}
        name={name}
        helperText={meta.touched ? meta.error : undefined}
        error={meta.error && meta.touched}
        inputProps={restInput}
        onChange={onChange}
        value={value}
        className={classes.textField}
      />
    </FormControl>
  )
);

const MySelect = withStyles(styles)(({ input, meta, classes, ...rest }) => (
  <FormControl required fullWidth className={classes.formControl}>
    <InputLabel htmlFor="type">Type</InputLabel>
    <Select input={<Input {...input} />} autoWidth>
      <MenuItem value="daily">Daily</MenuItem>
      <MenuItem value="weekly">Weekly</MenuItem>
    </Select>
    <FormHelperText error>
      {meta.touched ? meta.error : undefined}
    </FormHelperText>
  </FormControl>
));

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class HabitForm extends React.Component {
  validate = values => {
    const errors = {};

    if (!values.title) errors.title = 'Required';
    if (!values.type) errors.type = 'Required';

    return errors;
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        TransitionComponent={Transition}
        fullScreen
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.props.onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Form
          onSubmit={this.props.onSubmit}
          validate={this.validate}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form
              noValidate
              autoComplete="off"
              className={classes.form}
              onSubmit={handleSubmit}
            >
              <Typography
                variant="h5"
                align="left"
                className={classes.title}
              >
                New Scheduler
              </Typography>
              <Field name="title" component={MyTextField} label="Title" />
              <Field name="type" component={MySelect} label="Type" />
              <Button
                size="large"
                variant="outlined"
                className={classes.button}
                type="submit"
                disabled={submitting || pristine}
              >
                Save
              </Button>
            </form>
          )}
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(HabitForm);
