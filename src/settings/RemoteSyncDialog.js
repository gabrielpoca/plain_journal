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
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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

const validate = values => {
  const errors = {};

  if (!values.username) errors.username = 'Required';
  if (!values.password) errors.password = 'Required';

  return errors;
};

export default withStyles(styles)(function RemoteSyncDialog(props) {
  const { classes } = props;

  return (
    <Dialog
      TransitionComponent={Transition}
      fullScreen
      open={props.open}
      onClose={props.onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={props.onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Form
        onSubmit={props.onSubmit}
        validate={validate}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form
            noValidate
            autoComplete="off"
            className={classes.form}
            onSubmit={handleSubmit}
          >
            <Typography variant="h5" align="left" className={classes.title}>
              Sync to remote server
            </Typography>
            <Field name="username" component={MyTextField} label="Username" />
            <Field name="password" component={MyTextField} label="Password" />
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
});
