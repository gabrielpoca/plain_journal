import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Slide from '@material-ui/core/Slide';

import EntryPage from './EntryPage';
import EditEntryPage from './EditEntryPage';
import NewEntryPage from './NewEntryPage';
import EntriesPage from './EntriesPage';

export default ({ match }) => (
  <Switch>
    <Route path={`${match.path}/entry/:id/edit`} component={EditEntryPage} />
    <Route path={`${match.path}/entry/:id`} component={EntryPage} />
    <Route
      path={`${match.path}/`}
      render={() => (
        <>
          <Route path={`${match.path}/`} component={EntriesPage} />
          <Route
            path={`${match.path}/new`}
            children={props => (
              <Slide
                direction='up'
                in={!!props.match}
                mountOnEnter
                unmountOnExit>
                <NewEntryPage {...props} />
              </Slide>
            )}
          />
        </>
      )}
    />
  </Switch>
);
