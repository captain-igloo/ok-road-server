import * as Sentry from '@sentry/browser';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './map/App';
import { setConfig } from './config/slice';
import { fetchDevices, fetchLocations, setUser } from './map/slice';
import { setupStore } from './store';

const element = document.getElementById('app');
if (element) {
    const dataParams = element.getAttribute('data-params');
    if (dataParams) {
        const configuration = JSON.parse(dataParams);
        if (configuration.sentryDsn) {
            Sentry.init({
                dsn: configuration.sentryDsn,
            });
        }
        const root = ReactDOM.createRoot(element);
        const store = setupStore();
        root.render(
            <Provider store={store}>
                <App />
            </Provider>,
        );
        store.dispatch(fetchDevices()).then(() => {
            store.dispatch(fetchLocations());
        });
        store.dispatch(setUser(configuration.user));
        store.dispatch(setConfig(configuration));
    }
}
