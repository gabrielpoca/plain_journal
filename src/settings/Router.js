import React from "react";
import { Route } from "react-router-dom";

import { Dashboard } from './Dashboard';

export default ({ match }) => (
  <Route path={`${match.path}/`} component={Dashboard} />
);
