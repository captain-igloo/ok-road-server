import '../setup';

import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

import Chart from '../../ts/map/Chart';
import { setupStore } from '../../ts/store';

describe('Chart component', () => {
    test('Chart renders properly', () => {
        const { container } = render(
            <Provider store={setupStore({
                map: {
                    features: [{
                        id: 1,
                        insertTimestamp: 1744761600,
                        speedLimit: {
                            description: 'WELLINGTON CITY UTA',
                            speedLimit: 50,
                        },
                        timestamp: 1744761600,
                        velocity: 40,
                    }],
                    fromDate: new Date('2025-04-16 00:00:00').getTime(),
                    toDate: new Date('2025-04-17 00:00:00').getTime(),
                } as any,
            })}>
                <Chart />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});
