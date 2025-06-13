import * as Sentry from '@sentry/browser';
import * as React from 'react';
import Container from 'react-bootstrap/Container';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import Header from './Header';
import Important from './Important';
import { setupStore } from './store';

const element = document.getElementById('app');
if (element) {
    const dataParams = element.getAttribute('data-params');
    let configuration;
    if (dataParams) {
        configuration = JSON.parse(dataParams);
        if (configuration.sentryDsn) {
            Sentry.init({
                dsn: configuration.sentryDsn,
            });
        }
    }
    const root = ReactDOM.createRoot(element);
    root.render(
        <Provider store={setupStore()}>
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
                <Important>
                    Speed limit data is currently only available in New Zealand.
                </Important>
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
                        <a href="https://owntracks.org">OwnTracks</a>
                        {' '}
                        on the device you wish to monitor.
                    </li>
                    <li>
                        Configure OwnTracks to publish to OK Road:
                        <ul>
                            <li>Set Preferences / Connection / Endpoint / Host to &quot;192.9.176.238&quot;.</li>
                            <li>Set Preferences / Connection / Endpoint / Port to &quot;1883&quot;.</li>
                            <li>Set Preferences / Connection / Credentials / Username to your username.</li>
                            <li>Set Preferences / Connection / Credentials / Password to your password.</li>
                        </ul>
                    </li>
                    <li>
                        Make sure that OwnTracks has permission to use location services:
                        <ul>
                            <li>Set Settings / Location / OwnTracks / Location access to &quot;Allow all the time&quot;.</li>
                            <li>Set Settings / Location / OwnTracks / Use precise location to true.</li>
                        </ul>
                    </li>
                    <li>
                        Android can kill apps that have been running in the background for a period of time:
                        <ul>
                            <li>
                                Set Settings / Apps / OwnTracks / Battery to &quot;Unrestricted&quot;
                            </li>
                        </ul>
                    </li>
                </ol>
                <img alt="Screenshot" src="/img/okroad.png" />
            </Container>
        </Provider>,
    );
}
