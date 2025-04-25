import '../setup';

import {
    afterEach,
    describe,
    expect,
    test,
} from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { Provider } from 'react-redux';

import Friends from '../../ts/friends/Friends';
import { setupStore } from '../../ts/store';

const initialState = {
    friends: {
        friends: [{
            email: 'test@example.com',
            full_name: 'Test User',
            id: 1,
            username: 'testuser',
        }],
        show: true,
    },
};

describe('Friends component', () => {
    afterEach(() => {
        fetchMock.removeRoutes();
        fetchMock.clearHistory();
    });

    test('Friends should render properly', () => {
        const { container } = render(
            <Provider store={setupStore(initialState)}>
                <Friends />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    test('Delete friend should delete friend and refresh', async () => {
        fetchMock.delete('/api/friends/1', 204, { name: 'delete-friend' });
        fetchMock.get('/api/friends', [], { name: 'get-friends' });
        const { getByText } = render(
            <Provider store={setupStore(initialState)}>
                <Friends />
            </Provider>
        );
        await act(async () => {
            await fireEvent.click(getByText('Delete'));
        });
        expect(fetchMock.callHistory.called('delete-friend')).toBe(true);
        expect(fetchMock.callHistory.called('get-friends')).toBe(true);
    });

    test('Failure to delete friend should notify user', async () => {
        fetchMock.delete('/api/friends/1', 500);
        const store = setupStore(initialState);
        const { getByText } = render(
            <Provider store={store}>
                <Friends />
            </Provider>
        );
        await act(async () => {
            await fireEvent.click(getByText('Delete'));
        });
        expect(store.getState().notifications.notificationCount).toBe(1);
    });

    test('Click "Add" should add friend and refresh', async () => {
        fetchMock.post('/api/friends', {}, { name: 'add-friend' });
        fetchMock.get('/api/friends', [], { name: 'get-friends' });
        const { getByLabelText, getByText } = render(
            <Provider store={setupStore(initialState)}>
                <Friends />
            </Provider>
        );
        fireEvent.change(getByLabelText('Username'), { target: { value: 'test' }});
        await act(async () => {
            fireEvent.click(getByText('Add'));
        });
        expect(fetchMock.callHistory.called('add-friend')).toBe(true);
        expect(fetchMock.callHistory.called('get-friends')).toBe(true);
    });

    test('Add non-existent friend should notify user', async () => {
        fetchMock.post('/api/friends', 404, { name: 'add-friend' });
        const store = setupStore(initialState);
        const { getByLabelText, getByText } = render(
            <Provider store={store}>
                <Friends />
            </Provider>
        );
        fireEvent.change(getByLabelText('Username'), { target: { value: 'test' }});
        await act(async () => {
            fireEvent.click(getByText('Add'));
        });
        expect(store.getState().notifications.notificationCount).toBe(1);
    });

    test('Add duplicate friend should notify user', async () => {
        fetchMock.post('/api/friends', 409, { name: 'add-friend' });
        const store = setupStore(initialState);
        const { getByLabelText, getByText } = render(
            <Provider store={store}>
                <Friends />
            </Provider>
        );
        fireEvent.change(getByLabelText('Username'), { target: { value: 'test' }});
        await act(async () => {
            fireEvent.click(getByText('Add'));
        });
        expect(store.getState().notifications.notificationCount).toBe(1);
    });
});
