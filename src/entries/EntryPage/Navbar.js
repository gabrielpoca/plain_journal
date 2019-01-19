import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  toolbar: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

class LongMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  onClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <>
        <IconButton color="inherit" component={Link} to="/" aria-label="Close">
          <CloseIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.onClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.onClose}
        >
          <MenuItem component={Link} to={`${this.props.match.url}/edit`}>
            Edit
          </MenuItem>
          <MenuItem onClick={this.props.onDelete}>Delete</MenuItem>
        </Menu>
      </>
    );
  }
}

const Navbar = props => (
  <AppBar position="sticky">
    <Toolbar className={props.classes.toolbar}>
      <LongMenu {...props} />
    </Toolbar>
  </AppBar>
);

export default withRouter(withStyles(styles)(Navbar));
