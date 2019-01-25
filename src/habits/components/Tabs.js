import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';

import SidebarMenu from '../../components/SidebarMenu';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <SidebarMenu />
            </Toolbar>
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={this.handleChange}
            >
              <Tab label="Daily" />
              <Tab label="Weekly" />
            </Tabs>
          </AppBar>
          {value === 0 && this.props.renderDaily}
          {value === 1 && this.props.renderWeekly}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(SimpleTabs);
