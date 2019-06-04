import React from "react";
import { Form, Field } from "react-final-form";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  flex: {
    flex: 1
  },
  textField: {
    width: "100%"
  },
  form: {
    padding: theme.spacing(),
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  formControl: {
    margin: theme.spacing()
  },
  button: {
    marginTop: theme.spacing(2)
  },
  title: {
    width: "100%",
    marginTop: theme.spacing()
  },
  errorMessage: {
    marginTop: "8px"
  }
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
        error={(meta.error || meta.submitError) && meta.touched}
        inputProps={restInput}
        onChange={onChange}
        value={value}
        className={classes.textField}
      />
      {(meta.error || meta.submitError) && meta.touched && (
        <span className={classes.errorMessage}>
          {meta.error || meta.submitError}
        </span>
      )}
    </FormControl>
  )
);

function UserForm(props) {
  return (
    <Form
      onSubmit={props.onSubmit}
      validate={props.validate}
      render={({
        handleSubmit,
        reset,
        submitting,
        pristine,
        values,
        submitError
      }) => (
        <form
          noValidate
          autoComplete="off"
          className={props.classes.form}
          onSubmit={handleSubmit}
        >
          <Typography variant="h6" align="left" className={props.classes.title}>
            {props.formTitle || "New Session"}
          </Typography>
          <Field name="email" component={MyTextField} label="Email" />
          <Field
            name="password"
            type="password"
            component={MyTextField}
            label="Password"
          />
          {submitError && (
            <div className={props.classes.errorMessage}>{submitError}</div>
          )}
          <Button
            size="large"
            variant="outlined"
            className={props.classes.button}
            type="submit"
            disabled={submitting || pristine}
          >
            {props.buttonText || "Submit"}
          </Button>
        </form>
      )}
    />
  );
}

export default withStyles(styles)(UserForm);
