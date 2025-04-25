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

import FitBounds from '../../ts/map/FitBounds';

describe('FitBounds component', () => {
    test('fitBounds() should be called when bounds changes', () => {
        const fitBounds = jest.fn();
        (useMap as any).mockImplementation(() => ({
            fitBounds,
        }));
        render(
            <MapContainer>
                <FitBounds bounds={[[-41, 174], [-40, 175]]} />
            </MapContainer>
        );
        expect(fitBounds).toBeCalled();
        (useMap as any).mockRestore();
    });
});
