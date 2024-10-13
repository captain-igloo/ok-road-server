import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './map/App';
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
    store.dispatch(fetchDevices()).then(() => {
        store.dispatch(fetchLocations());
    });
    const dataParams = element.getAttribute('data-params');
    if (dataParams) {
        const user = JSON.parse(dataParams);
        store.dispatch(setUser(user));
    }
}
