import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import Map from './components/Map';
import configureStore from './model/app/configureStore';
import actions from './model/app/actions';

const store = configureStore();

const app = document.getElementById('app');
createRoot(app!).render(
    <Provider store={store}>
        <Map />
    </Provider>
);

store.dispatch(actions.initialize());

/* if (app) {
    // console.log('params', app.dataset.params);
    // console.log('getAttribute', app.getAttribute('data-params'));
    const root = createRoot(app);
    root.render(<Map />);
}*/
