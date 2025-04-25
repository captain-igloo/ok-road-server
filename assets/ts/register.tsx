import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import Register from './register/Register';
import { setupStore } from './store';

const element = document.getElementById('register');
if (element) {
    const dataParams = element.getAttribute('data-params');
    if (dataParams) {
        const root = ReactDOM.createRoot(element);
        root.render(
            <Provider store={setupStore()}>
                <Register form={JSON.parse(dataParams)} />
            </Provider>,
        );
    }
}
