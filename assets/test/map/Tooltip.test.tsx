import '../setup';

import {
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { MapContainer, useMap } from 'react-leaflet';
import { Provider } from 'react-redux';

import Tooltip from '../../ts/map/Tooltip';
import { setupStore } from '../../ts/store';

describe('Tooltip component', () => {
    test('Tooltip should render properly', () => {
        const addLayer = jest.fn();
        (useMap as any).mockImplementation(() => ({
            addLayer,
        }));
        const { container } = render(
            <Provider store={setupStore()}>
                <MapContainer>
                    <Tooltip tooltip={{} as any}/>
                </MapContainer>
            </Provider>
        );
        expect(container).toMatchSnapshot();
        (useMap as any).mockRestore();
    });
});
