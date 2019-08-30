import _ from "lodash";
import React, { useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { FORM_ERROR } from "final-form";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import MyLink from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

import UserForm from "../components/UserForm";
import { UserContext } from "../core/User";
import { useStyles } from "./styles";

const validate = values => {
  const errors = {};

  if (!values.email) errors.email = "Required";
  if (!values.password) errors.password = "Required";

  return errors;
};

function SignUp() {
  const classes = useStyles();
  const { user, signUp } = useContext(UserContext);

  if (user) return <Redirect to="/" />;

  const onSubmit = async values => {
    try {
      return await signUp(values.email, values.password);
    } catch (e) {
      let message = _.get(e, "response.data.reason");

      if (!message) message = e.message;

      return { [FORM_ERROR]: message };
    }
  };

  return (
    <>
      <AppBar className={classes.appBar}>
        <Container maxWidth="md">
          <Toolbar>
            <IconButton
              component={Link}
              to="/"
              color="inherit"
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="sm">
        <UserForm
          validate={validate}
          onSubmit={onSubmit}
          buttonText="Sign Up"
          formTitle="Sign Up"
        />
        <MyLink className={classes.link} component={Link} to="/account/sign_in">
          Aready registered? Click here to sign in
        </MyLink>
      </Container>
    </>
  );
}

export default SignUp;
