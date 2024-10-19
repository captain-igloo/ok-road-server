import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../store';

export interface FriendsState {
    friends: {
        email: string;
        full_name: string;
        id: number;
        username: string;
    }[];
    show: boolean;
}

const initialState: FriendsState = {
    friends: [],
    show: false,
};

export const addFriend = createAsyncThunk<any, string, {state: RootState}>(
    'friends/addFriendStatus',
    async (username: string, { dispatch }) => {
        const url = '/api/friends';
        const response = await fetch(url, {
            body: JSON.stringify({ username }),
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            method: 'post',
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${url}`);
        }
        dispatch(fetchFriends());
        return await response.json();
    },
);

export const fetchFriends = createAsyncThunk<any, void, {state: RootState}>(
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

export const deleteFriend = createAsyncThunk<any, number, {state: RootState}>(
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
        return await response.json();
    },
);

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

export const showFriends = (show: boolean) => (dispatch: AppDispatch) => {
    dispatch(friendsSlice.actions.showFriends(show));
    if (show) {
        dispatch(fetchFriends());
    }
};

export default friendsSlice.reducer;
