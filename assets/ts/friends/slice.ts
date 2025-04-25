import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { addNotification } from '../notifications/slice';
import type { AppDispatch, RootState } from '../store';

interface Friend {
    email: string;
    full_name: string;
    id: number;
    username: string;
}

export interface FriendsState {
    friends: Friend[];
    show: boolean;
}

const initialState: FriendsState = {
    friends: [],
    show: false,
};

export const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        showFriends: (state, action: PayloadAction<boolean>) => {
            state.show = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFriends.fulfilled, (state, action) => {
            state.friends = action.payload;
        });
    },
});

export const fetchFriends = createAsyncThunk<Friend[], void, { dispatch: AppDispatch; state: RootState; }>(
    'friends/fetchFriendsStatus',
    async (_, { dispatch }) => {
        const url = '/api/friends';
        const response = await fetch(url);
        if (!response.ok) {
            dispatch(addNotification('Failed to get friends'));
            throw new Error(`Failed to fetch: ${url}`);
        }
        return response.json();
    },
);

export const addFriend = createAsyncThunk<Friend, string, { dispatch: AppDispatch, state: RootState }>(
    'friends/addFriendStatus',
    async (username: string, { dispatch }) => {
        const url = '/api/friends';
        const response = await fetch(url, {
            body: JSON.stringify({ username }),
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            method: 'post',
        });
        if (!response.ok) {
            let message = 'Failed to add friend';
            if (response.status === 404) {
                message = 'User not found';
            } else if (response.status === 409) {
                message = `You are already friends with ${username}`;
            }
            dispatch(addNotification(message));
            throw new Error(`Failed to fetch: ${url}`);
        }
        dispatch(fetchFriends());
        return response.json();
    },
);

export const deleteFriend = createAsyncThunk<void, number, { dispatch: AppDispatch; state: RootState; }>(
    'friends/deleteFriendStatus',
    async (id: number, { dispatch }) => {
        const url = `/api/friends/${id}`;
        const response = await fetch(url, {
            method: 'delete',
        });
        if (!response.ok) {
            dispatch(addNotification('Failed to delete friend'));
            throw new Error(`Failed to fetch: ${url}`);
        }
        await dispatch(fetchFriends());
    },
);

export const showFriends = (show: boolean) => (dispatch: AppDispatch) => {
    dispatch(friendsSlice.actions.showFriends(show));
    if (show) {
        dispatch(fetchFriends());
    }
};

export default friendsSlice.reducer;
