import React from 'react';
import { Route, Switch } from 'react-router-dom';

class Dashboard extends React.Component {
  render() {
    return <h1>Dashboard</h1>;
  }
}

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/`} component={Dashboard} />
  </Switch>
);
