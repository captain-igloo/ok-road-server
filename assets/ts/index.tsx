import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
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
            <Container style={{ paddingTop: '5px' }}>
                <h1>Monitor Young Drivers</h1>
                <p>
                    Install an app on their device and keep track of:
                </p>
                <ul>
                    <li>Where they are</li>
                    <li>How fast they are driving</li>
                    <li>Their speed in relation to the speed limit</li>
                </ul>
                <Alert variant="warning">
                    Speed limit data is only available in New Zealand.
                </Alert>
                <h2>Getting Started</h2>
                <ol>
                    <li>
                        Click
                        {' '}
                        <a href="/register">here</a>
                        {' '}
                        to register with OK Road.  Remember your username and password because you
                        will need it in step 3.
                    </li>
                    <li>
                        Install
                        {' '}
                        <a href="https://owntracks.org">Owntracks</a>
                        {' '}
                        on the device you wish to monitor.
                    </li>
                    <li>Configure Owntracks to publish to OK Road.</li>
                </ol>
                <img src="/img/okroad.png" />
            </Container>
        </Provider>,
    );
}
