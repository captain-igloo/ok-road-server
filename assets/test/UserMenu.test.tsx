import {
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';

import * as friendsSlice from '../ts/friends/slice';
import { setupStore } from '../ts/store';
import UserMenu from '../ts/UserMenu';

describe('UserMenu component', () => {
    test('UserMenu renders properly (not logged in)', () => {
        const { container } = render(<UserMenu showDemo showMap showRegister showSignIn />);
        expect(container).toMatchSnapshot();
    });

    test('UserMenu renders properly (logged in)', () => {
        const { container } = render(
            <Provider store={setupStore()}>
                <UserMenu showDemo showMap showRegister showSignIn user={{fullName: 'Test User'}}/>
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    test('Click "Friends" should show friends', async () => {
        const showFriends = jest.spyOn(friendsSlice, 'showFriends');
        const { getByText } = render(
            <Provider store={setupStore()}>
                <UserMenu showDemo showMap showRegister showSignIn user={{fullName: 'Test User'}}/>
            </Provider>
        );
        await act(async () => {
            await fireEvent.click(getByText('Test User'));
        });
        await act(async () => {
            await fireEvent.click(getByText('Friends'));
        });
        expect(showFriends).toHaveBeenCalledWith(true);
        showFriends.mockRestore();
    });
});
