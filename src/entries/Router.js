import React from 'react';
import { Route, Switch } from 'react-router-dom';

import EntryPage from './EntryPage';
import EditEntryPage from './EditEntryPage';
import NewEntryPage from './NewEntryPage';
import EntriesPage from './EntriesPage';

export default ({ match }) => (
  <Switch>
    <Route
      path={`${match.path}`}
      render={() => (
        <Switch>
          <Route exact path={`${match.path}/`} component={EntriesPage} />
          <Route exact path={`${match.path}/new`} component={NewEntryPage} />
          <Route
            path={`${match.path}/entry/:id/edit`}
            component={EditEntryPage}
          />
          <Route path={`${match.path}/entry/:id`} component={EntryPage} />
        </Switch>
      )}
    />
  </Switch>
);
