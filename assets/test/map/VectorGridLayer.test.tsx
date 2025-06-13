import '../setup';

import {
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import { render } from '@testing-library/react';
import L from 'leaflet';
import * as React from 'react';
import { useMap } from 'react-leaflet';
import { Provider } from 'react-redux';

import VectorGridLayer from '../../ts/map/VectorGridLayer';
import { setupStore } from '../../ts/store';

describe('VectorGridLayer component', () => {
    test('asdf', () => {
        (L.vectorGrid.protobuf as any) = jest.fn().mockImplementation(() => {
            return {
                _vectorTiles: {
                    '31:19:5': {
                        _features: {
                            1: {
                                feature: {
                                    _parts: [[
                                        {x: 0, y: 0},
                                        {x: 256, y: 0},
                                        {x: 256, y: 256},
                                        {x: 0, y: 256},
                                        {x: 0, y: 0},
                                    ]],
                                    properties: {
                                        description: 'abc',
                                        speed_limit: 100,
                                    },
                                },
                            },
                        }
                    }
                },
                addTo: () => {},
                on: () => {},
                remove: () => {},
                setFeatureStyle: () => {},
            };
        });
        (useMap as any).mockImplementation(() => ({
            addLayer: () => {},
            getZoom: () => 5,
            off: () => {},
            on: (eventType, handler) => {
                handler({
                    latlng: {
                        lat: -40,
                        lng: 174,
                    },
                });
            },
            project: () => ({
                x: 8000,
                y: 5000,
            }),
        }));

        const store = setupStore();

        render(
            <Provider store={store}>
                <VectorGridLayer speedLimitTilesUrl="" />
            </Provider>
        );
        expect(store.getState().map.tooltip).toStrictEqual({
            position: undefined,
            text: {
                'Speed Limit': ['100km/h abc'],
            },
        });
        (useMap as any).mockRestore();
    });
});
