import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';

import Header from '../ts/Header';

describe('Header component', () => {
    test('Header renders properly', () => {
        const { container } = render(<Header showDemo showMap showRegister showSignIn />);
        expect(container).toMatchSnapshot();
    });
});
