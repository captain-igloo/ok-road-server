import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

import Important from '../ts/Important';

describe('Important component', () => {
    test('Important renders properly', () => {
        const { container } = render(<Important>Message!</Important>);
        expect(container).toMatchSnapshot();
    });
});
