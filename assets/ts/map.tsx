import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './map/App';
import { setConfig } from './config/slice';
import { fetchDevices, fetchLocations, setUser } from './map/slice';
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
        const configuration = JSON.parse(dataParams);
        store.dispatch(setUser(configuration.user));
        store.dispatch(setConfig(configuration));
    }
}
