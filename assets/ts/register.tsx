import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import Register from './register/Register';

const element = document.getElementById('register');
if (element) {
    const dataParams = element.getAttribute('data-params');
    if (dataParams) {
        const root = ReactDOM.createRoot(element);
        root.render(<Register form={JSON.parse(dataParams)} />);
    }
}
