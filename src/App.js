import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { createGlobalStyle } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';

import EntriesRouter from './entries/Router';

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
        <CssBaseline />
        <EntriesRouter />
      </React.Fragment>
    );
  }
}

export default withRouter(App);
