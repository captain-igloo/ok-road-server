import '../setup';

import {
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { useMap } from 'react-leaflet';
import { Provider } from 'react-redux';

import Map from '../../ts/map/Map';
import { setupStore } from '../../ts/store';

jest.mock('../../ts/map/ButtonControl');

describe('Map component', () => {
    test('Map should render properly', () => {
        const addLayer = jest.fn();
        (useMap as any).mockImplementation(() => ({
            addLayer,
        }));
        const { container } = render(
            <Provider store={setupStore()}>
                <Map />
            </Provider>,
        );
        expect(container).toMatchSnapshot();
    });
});
