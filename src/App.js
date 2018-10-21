import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { createGlobalStyle } from 'styled-components';

import EntryPage from './EntryPage';
import EditEntryPage from './EditEntryPage';
import NewEntryPage from './NewEntryPage';
import EntriesPage from './EntriesPage';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    -webkit-font-smoothing: antialised;
    font-family: 'Roboto', sans-serif;
    font-family: 16px;
    height: 100%;
    line-height: 1.25em;
    margin: 0;
    padding: 0;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  p {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  h1, h2, h3, h4 {
    margin: 16px 0 8px;
    line-height: 1.25em;
  }
  
  :root {
    --max-width: 640px;
    --nav-height: 56px;
  }
`;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <Switch>
          <Route exact path="/new">
            <NewEntryPage {...this.props} />
          </Route>
          <Route path="/entry/:id/edit" component={EditEntryPage} />
          <Route path="/entry/:id" component={EntryPage} />
          <Route exact path="/" component={EntriesPage} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
