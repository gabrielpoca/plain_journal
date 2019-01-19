import React from 'react';
import { Route, Switch } from 'react-router-dom';

import EntryPage from './EntryPage';
import EditEntryPage from './EditEntryPage';
import NewEntryPage from './NewEntryPage';
import EntriesPage from './EntriesPage';

export default () => (
  <Switch>
    <Route exact path="/new" component={NewEntryPage} />
    <Route path="/entry/:id/edit" component={EditEntryPage} />
    <Route path="/entry/:id" component={EntryPage} />
    <Route exact path="/" component={EntriesPage} />
  </Switch>
);
