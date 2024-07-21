import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { fetchDevices, fetchLocations, setUser } from './slice';
import { store } from './store';

const element = document.getElementById('app');
if (element) {
    const root = ReactDOM.createRoot(element);
    root.render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    store.dispatch(fetchDevices());
    store.dispatch(fetchLocations());
    setInterval(() => {
        store.dispatch(fetchLocations());
    }, 300000);
    const dataParams = element.getAttribute('data-params');
    if (dataParams) {
        const user = JSON.parse(dataParams);
        store.dispatch(setUser(user));
    }
}
