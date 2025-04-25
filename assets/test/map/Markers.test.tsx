import '../setup';

import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

import Markers from '../../ts/map/Markers';
import { setupStore } from '../../ts/store';

describe('Markers component', () => {
    test('Markers should render properly', () => {
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
                    }],
                } as any,
            })}>
                <Markers />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});
