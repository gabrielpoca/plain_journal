import React from "react";
import { Form, Field } from "react-final-form";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { MyTextField } from "./MyTextField";

const styles = theme => ({
  flex: {
    flex: 1
  },
  form: {
    padding: theme.spacing(),
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
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
          <Box mb={2} width="100%">
            <Typography
              variant="h6"
              align="left"
              className={props.classes.title}
            >
              {props.formTitle || "New Session"}
            </Typography>
          </Box>
          <Box mb={2} width="100%">
            <Field name="email" component={MyTextField} label="Email" />
          </Box>
          <Box mb={2} width="100%">
            <Field
              name="password"
              type="password"
              component={MyTextField}
              label="Password"
            />
          </Box>
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
