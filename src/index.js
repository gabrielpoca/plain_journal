import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import grey from '@material-ui/core/colors/grey';
import pink from '@material-ui/core/colors/pink';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { initializeFirebase } from './notifications';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: grey[900] },
    secondary: pink,
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root')
);

initializeFirebase();
registerServiceWorker();
