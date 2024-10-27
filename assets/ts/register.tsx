import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import Register from './register/Register';
import { store } from './store';

const element = document.getElementById('register');
if (element) {
    const dataParams = element.getAttribute('data-params');
    if (dataParams) {
        const root = ReactDOM.createRoot(element);
        root.render(
            <Provider store={store}>
                <Register form={JSON.parse(dataParams)} />
            </Provider>,
        );
    }
}
