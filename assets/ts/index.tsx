import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import Header from './Header';
import { store } from './store';

const element = document.getElementById('app');
if (element) {
    const dataParams = element.getAttribute('data-params');
    let configuration;
    if (dataParams) {
        configuration = JSON.parse(dataParams);
    }
    const root = ReactDOM.createRoot(element);
    root.render(
        <Provider store={store}>
            <Header user={configuration.user} />
        </Provider>
    );
}
