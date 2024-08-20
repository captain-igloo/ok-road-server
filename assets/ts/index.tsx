import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import Header from './Header';

const element = document.getElementById('app');
if (element) {
    const dataParams = element.getAttribute('data-params');
    let configuration;
    if (dataParams) {
        configuration = JSON.parse(dataParams);
    }

    const root = ReactDOM.createRoot(element);
    root.render(
        <Header user={configuration.user} />,
    );
}
