import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from './Navbar';

class Dashboard extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <h1>Dashboard</h1>
      </>
    );
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={Dashboard} />
  </Switch>
);
