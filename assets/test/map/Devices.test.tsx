import '../setup';

import { describe, expect, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

import Devices from '../../ts/map/Devices';
import { setupStore } from '../../ts/store';

const initialState = {
    map: {
        devices: [{
            description: 'description',
            id: 1,
            name: 'device-1',
            username: 'testuser',
        }],
        toDate: 0,
        user: {
            fullName: 'Test User',
            username: 'testuser'
        },
    },
};

describe('Devices component', () => {
    test('Devices should render properly', () => {
        const { container } = render(
            <Provider store={setupStore(initialState as any)}>
                <Devices />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    test('Select device should set selectedDevice', () => {
        const store = setupStore(initialState as any);
        const { getByLabelText } = render(
            <Provider store={store}>
                <Devices />
            </Provider>
        );
        fireEvent.change(getByLabelText('Device'), { target: { value: 1 }});
        expect(store.getState().map.selectedDevice).toBe(1);
    });
});
