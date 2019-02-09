import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SmsIcon from '@material-ui/icons/Sms';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import { withRouter } from 'react-router';

const styles = theme => {
  return {
    root: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: theme.palette.background.default,
    },
    iconRoot: {
      color: theme.palette.grey['300'],
      '&$iconSelected': {
        color: theme.palette.grey['700'],
      },
    },
    iconSelected: {},
  };
};

class BottomNavbar extends React.PureComponent {
  get value() {
    return this.props.match.url.startsWith('/entries') ? 0 : 1;
  }

  render() {
    const {
      classes: { root, iconRoot, iconSelected },
    } = this.props;

    return (
      <BottomNavigation
        value={this.value}
        color="primary"
        showLabels
        classes={{ root }}
      >
        <BottomNavigationAction
          classes={{ selected: iconSelected, root: iconRoot }}
          component={Link}
          label="Journal"
          to="/entries"
          icon={<SmsIcon />}
        />
        <BottomNavigationAction
          classes={{ selected: iconSelected, root: iconRoot }}
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
