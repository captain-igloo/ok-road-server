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

import Tooltip from '../../ts/map/Tooltip';

describe('Tooltip component', () => {
    test('Tooltip should render properly', () => {
        const addLayer = jest.fn();
        (useMap as any).mockImplementation(() => ({
            addLayer,
        }));
        const { container } = render(
            <Tooltip tooltip={{} as any}/>
        );
        expect(container).toMatchSnapshot();
    });
});
