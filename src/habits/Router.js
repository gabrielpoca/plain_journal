import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { habits } from './db';
import Navbar from './Navbar';
import FormToggle from './FormToggle';

class Dashboard extends React.Component {
  state = {
    schedules: [],
  };

  componentWillMount() {
    this.sub = habits
      .changes({
        since: 'now',
        live: true,
      })
      .on('change', this.update);
    this.update();
  }

  componentWillUnmount() {
    this.sub.cancel();
  }

  update = async () => {
    const schedules = (await habits.allDocs()).docs || [];
    this.setState({ schedules });
  };

  render() {
    return (
      <>
        <Navbar />
        <h1>Dashboard</h1>
        <FormToggle />
      </>
    );
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={Dashboard} />
  </Switch>
);
