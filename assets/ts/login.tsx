import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import Login from './Login';
import { Provider } from 'react-redux';
import { store } from './store';

const element = document.getElementById('login');

if (element) {
    const root = ReactDOM.createRoot(element);
    root.render(
        <Provider store={store}>
          <Login />
        </Provider>,
      );
}
