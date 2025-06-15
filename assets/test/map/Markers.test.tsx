import '../setup';

import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { MapContainer, useMap } from 'react-leaflet';
import { Provider } from 'react-redux';

import Markers from '../../ts/map/Markers';
import { setupStore } from '../../ts/store';

const map = {
    addLayer: () => {},
    removeLayer: () => {},
};

describe('Markers component', () => {
    test('Markers should render properly', () => {
        (useMap as any).mockImplementation(() => map);
        const { container } = render(
            <Provider store={setupStore({
                map: {
                    features: [{
                        coordinates: [174, -40],
                        id: 1,
                        insertTimestamp: 1744424257,
                        speedLimit: {
                            description: 'WELLINGTON CITY UTA',
                            speedLimit: 50,
                        },
                        timestamp: 1744424257,
                        velocity: 40,
                    }, {
                        coordinates: [174, -40],
                        id: 1,
                        insertTimestamp: 1744424257,
                        speedLimit: {
                            description: 'WELLINGTON CITY UTA',
                            speedLimit: 50,
                        },
                        timestamp: 1744424257,
                        velocity: 60,
                    }],
                } as any,
            })}>
                <MapContainer>
                    <Markers features={{}} />
                </MapContainer>
            </Provider>
        );
        expect(container).toMatchSnapshot();
        (useMap as any).mockRestore();
    });
});
