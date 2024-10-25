import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../store';

interface Friend {
    email: string;
    full_name: string;
    id: number;
    username: string;
}

export interface FriendsState {
    add_friend_error?: string;
    friends: Friend[];
    show: boolean;
}

const initialState: FriendsState = {
    add_friend_error: undefined,
    friends: [],
    show: false,
};

export const addFriend = createAsyncThunk<Friend, string, {state: RootState}>(
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
            dispatch(friendsSlice.actions.setAddFriendError(message));
            throw new Error(`Failed to fetch: ${url}`);
        }
        dispatch(friendsSlice.actions.setAddFriendError());
        dispatch(fetchFriends());
        return await response.json();
    },
);

export const fetchFriends = createAsyncThunk<Friend[], void, {state: RootState}>(
    'friends/fetchFriendsStatus',
    async () => {
        const url = '/api/friends';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${url}`);
        }
        return await response.json();
    },
);

export const deleteFriend = createAsyncThunk<void, number, {state: RootState}>(
    'friends/deleteFriendStatus',
    async (id: number, { dispatch }) => {
        const url = `/api/friends/${id}`;
        const response = await fetch(url, {
            method: 'delete',
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${url}`);
        }
        dispatch(fetchFriends());
    },
);

export const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setAddFriendError: (state, action: PayloadAction<string | undefined>) => {
            state.add_friend_error = action.payload;
        },
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

export const showFriends = (show: boolean) => (dispatch: AppDispatch) => {
    dispatch(friendsSlice.actions.showFriends(show));
    if (show) {
        dispatch(fetchFriends());
    }
};

export default friendsSlice.reducer;
