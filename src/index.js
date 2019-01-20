import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {
  initializeFirebase,
  askForPermissioToReceiveNotifications,
} from './notifications';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

initializeFirebase();
registerServiceWorker();
askForPermissioToReceiveNotifications();
