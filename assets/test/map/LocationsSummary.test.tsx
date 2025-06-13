import '../setup';

import { describe, expect, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

import LocationsSummary from '../../ts/map/LocationsSummary';
import { setupStore } from '../../ts/store';

const initialState = {
    map: {
        features:[{
            id: 1,
            insertTimestamp: 1744424257,
            speedLimit: {
                description: 'WELLINGTON CITY UTA',
                speedLimit: 50,
            },
            timestamp: 1744424257,
            velocity: 40,
        }, {
            id: 2,
            insertTimestamp: 1744424257,
            speedLimit: {
                description: 'WELLINGTON CITY UTA',
                speedLimit: 50,
            },
            timestamp: 1744424257,
            velocity: 60,
        }],
        highlightedLocation: 1,
    },
};

describe('LocationsSummary component', () => {
    test('LocationsSummary renders properly', () => {
        const { container } = render(
            <Provider store={setupStore(initialState as any)}>
                <LocationsSummary />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    test('Mouse over location should highlight', () => {
        const store = setupStore(initialState as any);
        const { getByTitle } = render(
            <Provider store={store}>
                <LocationsSummary />
            </Provider>
        );
        fireEvent.mouseOver(getByTitle('Within speed limit'));
        expect(store.getState().map.highlightedLocations).toStrictEqual([1]);
    });

    test('Mouse out should unhighlight', () => {
        const store = setupStore(initialState as any);
        const { getByTitle } = render(
            <Provider store={store}>
                <LocationsSummary />
            </Provider>
        );
        fireEvent.mouseOut(getByTitle('Within speed limit'));
        expect(store.getState().map.highlightedLocations).toStrictEqual([]);
    });
});
