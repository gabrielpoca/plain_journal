import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import EntryPage from './EntryPage';
import NewEntryPage from './NewEntryPage';
import EntriesPage from './EntriesPage';

import 'highlight.js/styles/railscasts.css';
import 'react-quill/dist/quill.snow.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/new">
            <NewEntryPage {...this.props} />
          </Route>
          <Route path="/entry/:id" component={EntryPage} />
          <Route exact path="/" component={EntriesPage} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
