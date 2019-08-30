import React from "react";
import { Form, Field } from "react-final-form";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";

import { MyTextField } from "../components/MyTextField";
import { NavbarTitle } from "../components/NavbarTitle";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(3),
    display: "grid",
    gridRowGap: theme.spacing(1),
    maxWidth: 550,
    margin: "0 auto"
  },
  p: {},
  button: {}
}));

const validate = values => {
  const errors = {};

  if (!values.password) errors.password = "Required";
  if (values.password && values.password.length < 12)
    errors.password = "Your password must be 12 characters long";

  return errors;
};

export function EncryptionPassword(props) {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Grid container direction="row" justify="center" alignItems="center">
          <NavbarTitle />
        </Grid>
      </AppBar>
      <Form
        validate={validate}
        onSubmit={values => props.onSubmit(values.password)}
        render={({ handleSubmit, submitting, pristine }) => (
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Typography className={classes.p}>
              Before we start, you must define your encryption password.
            </Typography>
            <Typography>
              We use this password to encrypt your data so that only you can
              access it. For that reason, it's important that you properly save
              this password in case you need it again. If you lose this
              password, you won't be able to recover your data.
            </Typography>
            <Field
              name="password"
              type="password"
              component={MyTextField}
              label="Password"
            />
            <Box>
              <Button
                className={classes.button}
                size="large"
                variant="contained"
                type="submit"
                color="primary"
                disabled={submitting || pristine}
              >
                Set Password
              </Button>
            </Box>
            {!!props.wrongPassword && (
              <Typography className={classes.p} color="error">
                The password you entered is not the same password that you
                entered initially. To move forward, you must enter the correct
                password.
              </Typography>
            )}
          </form>
        )}
      />
    </>
  );
}
