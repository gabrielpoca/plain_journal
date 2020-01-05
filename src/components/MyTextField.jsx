import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  formControl: {},
  errorMessage: {
    marginTop: theme.spacing(1)
  }
});

export const MyTextField = withStyles(styles)(
  ({
    input: { name, onChange, value, ...restInput },
    meta,
    classes,
    ...rest
  }) => {
    return (
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          {...rest}
          name={name}
          helperText={meta.touched ? meta.error : undefined}
          error={(meta.error || meta.submitError) && meta.touched}
          inputProps={restInput}
          onChange={onChange}
          value={value}
          className={classes.textField}
          variant="outlined"
          color="secondary"
        />
      </FormControl>
    );
  }
);
