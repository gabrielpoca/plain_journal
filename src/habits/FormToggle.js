import React from 'react';

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

class FormToggle extends React.Component {
  state = {
    open: true,
  };

  onToggle = () => this.setState({ open: !this.state.open });

  render() {
    const { classes } = this.props;

    return (
      <>
        <Button variant="outlined" color="primary" onClick={this.onToggle}>
          New Habit
        </Button>
        <Dialog fullScreen open={this.state.open} onClose={this.onToggle}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.onToggle}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <form noValidate autoComplete="off" className={classes.form}>
            <Typography
              gutterBottom
              variant="title"
              align="left"
              className={classes.title}
            >
              New Scheduler
            </Typography>
            <FormControl
              fullWidth
              variant="filled"
              className={classes.formControl}
            >
              <TextField
                required
                className={classes.textField}
                label="Title"
                id="title"
                helperText="Your new habit's title"
              />
            </FormControl>
            <FormControl required fullWidth className={classes.formControl}>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select input={<Input name="type" id="type" />} autoWidth>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
              <FormHelperText>The habit type</FormHelperText>
            </FormControl>
            <Button size="large" variant="outlined" className={classes.button}>
              Save
            </Button>
          </form>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(FormToggle);
