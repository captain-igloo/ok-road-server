import '../setup';

import { describe, expect, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

import Search from '../../ts/map/Search';
import { setupStore } from '../../ts/store';

describe('Search component', () => {
    test('Search should render properly', () => {
        const fromDate = new Date('2025-04-16 00:00:00');
        const toDate = new Date('2025-04-17 00:00:00');
        const { container } = render(
            <Provider
                store={setupStore({
                    map: {
                        devices: [],
                        fromDate: fromDate.getTime(),
                        toDate: toDate.getTime(),
                    } as any,
                })}
            >
                <Search />
            </Provider>,
        );
        expect(container).toMatchSnapshot();
    });

    test('Change from date should set fromDate', () => {
        const store = setupStore({
            map: {
                devices: [],
                fromDate: Date.now(),
            } as any,
        });
        const { getByLabelText } = render(
            <Provider store={store}>
                <Search />
            </Provider>,
        );
        fireEvent.change(getByLabelText('From'), { target: { value: '2025-05-16T00:00' }});
        expect(store.getState().map.fromDate).toBe(1747310400000);
    });

    test('Change to date should set toDate', () => {
        const store = setupStore({
            map: {
                devices: [],
                toDate: Date.now(),
            } as any,
        });
        const { getByLabelText } = render(
            <Provider store={store}>
                <Search />
            </Provider>,
        );
        fireEvent.change(getByLabelText('To'), { target: { value: '2025-05-16T00:00' }});
        expect(store.getState().map.toDate).toBe(1747310400000);
    });
});
