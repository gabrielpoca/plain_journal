import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SmsIcon from '@material-ui/icons/Sms';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import { withRouter } from 'react-router';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class BottomNavbar extends React.PureComponent {
  get value() {
    return this.props.match.url.startsWith('/entries') ? 0 : 1;
  }

  render() {
    return (
      <BottomNavigation
        value={this.value}
        showLabels
        color="primary"
        classes={this.props.classes}
      >
        <BottomNavigationAction
          component={Link}
          label="Journal"
          to="/entries"
          icon={<SmsIcon />}
        />
        <BottomNavigationAction
          component={Link}
          label="Habits"
          to="/habits"
          icon={<FitnessCenterIcon />}
        />
      </BottomNavigation>
    );
  }
}

export default withRouter(withStyles(styles)(BottomNavbar));
